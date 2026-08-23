import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import {
  LogOut,
  Plus,
  Copy,
  ShoppingCart,
  Home as HomeIcon,
  History,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { GroceryList } from './GroceryList';
import { AddItemDialog } from './AddItemDialog';
import { PurchaseHistory } from './PurchaseHistory';
import { Bills } from './Bills';
import { DashboardHome } from './DashboardHome';
import { groceryService } from '../../services/groceryService';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Household {
  id: number;
  name: string;
  inviteCode: string;
}

export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  addedById: number;
  claimedBy?: string;
  claimedById?: number;
  purchasedBy?: string;
  purchasedById?: number;
  price?: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface GroceryDashboardProps {
  user: User;
  household: Household;
  onLogout: () => void;
}

type ActiveView = 'home' | 'list' | 'history' | 'bills';

export function GroceryDashboard({ user, household, onLogout }: GroceryDashboardProps) {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [purchaseHistory, setPurchaseHistory] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const [active, history] = await Promise.all([
        groceryService.getActiveItems(),
        groceryService.getPurchaseHistory(),
      ]);
      setItems(active);
      setPurchaseHistory(history);
    } catch (err) {
      toast.error('Could not load the grocery list. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = async () => {
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(household.inviteCode);
      toast.success('Invite code copied to clipboard!');
    } catch (err) {
      // Fallback: create a temporary input element
      try {
        const textArea = document.createElement('textarea');
        textArea.value = household.inviteCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          toast.success('Invite code copied to clipboard!');
        } else {
          // Show the code in a toast if copy fails
          toast.info(`Invite code: ${household.inviteCode}`, { duration: 5000 });
        }
      } catch (fallbackErr) {
        // If all else fails, show the code
        toast.info(`Invite code: ${household.inviteCode}`, { duration: 5000 });
      }
    }
  };

  const handleAddItem = async (name: string, quantity: number, category: string) => {
    try {
      const newItem = await groceryService.createItem(name, quantity, category);
      setItems(prev => [...prev, newItem]);
      toast.success(`Added ${name} to the list`);
    } catch (err) {
      toast.error(`Could not add ${name}. Please try again.`);
    }
  };

  const handleClaimItem = async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    const wasClaimedByMe = item?.claimedById === user.id;

    try {
      const updated = await groceryService.claimItem(itemId);
      setItems(prev => prev.map(i => (i.id === itemId ? updated : i)));
      toast[wasClaimedByMe ? 'info' : 'success'](
        wasClaimedByMe ? `Unclaimed ${item?.name}` : `You claimed ${item?.name}!`
      );
    } catch (err) {
      toast.error('Could not update the claim. Please try again.');
    }
  };

  const handleCompleteItem = async (itemId: number, price: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const completedItem = await groceryService.completeItem(itemId, price);
      setPurchaseHistory(prev => [completedItem, ...prev]);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success(`${item.name} marked as purchased for $${price.toFixed(2)}!`);
    } catch (err) {
      toast.error('Could not complete the purchase. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    try {
      await groceryService.deleteItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.info(`Removed ${item?.name} from the list`);
    } catch (err) {
      toast.error('Could not remove the item. Please try again.');
    }
  };

  const activeItems = items.filter(item => !item.completed);

  const renderMainContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <DashboardHome
            user={user}
            household={household}
            items={activeItems}
            purchaseHistory={purchaseHistory}
            onNavigate={setActiveView}
          />
        );
      case 'list':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
                <p className="text-gray-600 mt-1">
                  {activeItems.length} {activeItems.length === 1 ? 'item' : 'items'} to buy
                </p>
              </div>
              <Button
                variant="contained"
                className="bg-emerald-500 hover:bg-emerald-600"
                startIcon={<Plus className="w-5 h-5" />}
                onClick={() => setShowAddDialog(true)}
              >
                Add Item
              </Button>
            </div>

            <GroceryList
              items={activeItems}
              currentUserId={user.id}
              onClaim={handleClaimItem}
              onComplete={handleCompleteItem}
              onDelete={handleDeleteItem}
            />
          </>
        );
      case 'history':
        return <PurchaseHistory history={purchaseHistory} />;
      case 'bills':
        return <Bills purchaseHistory={purchaseHistory} currentUserId={user.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{household.name}</h1>
              <p className="text-xs text-gray-500">{user.name}</p>
            </div>
          </div>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<Copy className="w-4 h-4" />}
            onClick={handleCopyInviteCode}
          >
            {household.inviteCode}
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'home'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveView('list')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'list'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Grocery List</span>
              {activeItems.length > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'history'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="font-medium">History</span>
            </button>

            <button
              onClick={() => setActiveView('bills')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'bills'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span className="font-medium">Bills</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogOut className="w-5 h-5" />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="max-w-6xl mx-auto px-8 py-8">
          {loading ? (
            <p className="text-gray-500">Loading your grocery list...</p>
          ) : (
            renderMainContent()
          )}
        </main>
      </div>

      <AddItemDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}

