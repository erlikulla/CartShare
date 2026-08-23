import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { Chip } from '@mui/material';
import { Check, Hand, Trash2, ShoppingBasket } from 'lucide-react';
import type { GroceryItem } from './GroceryDashboard';
import { CompletePurchaseDialog } from './CompletePurchaseDialog';

interface GroceryListProps {
  items: GroceryItem[];
  currentUserId: number;
  onClaim: (itemId: number) => void;
  onComplete: (itemId: number, price: number) => void;
  onDelete: (itemId: number) => void;
}

const categoryColors: Record<string, string> = {
  'Dairy': 'bg-blue-100 text-blue-800',
  'Produce': 'bg-green-100 text-green-800',
  'Snacks': 'bg-orange-100 text-orange-800',
  'Meat': 'bg-red-100 text-red-800',
  'Bakery': 'bg-yellow-100 text-yellow-800',
  'Beverages': 'bg-purple-100 text-purple-800',
  'Other': 'bg-gray-100 text-gray-800',
};

export function GroceryList({ items, currentUserId, onClaim, onComplete, onDelete }: GroceryListProps) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const selectedItem = items.find(item => item.id === selectedItemId);

  const handleCompleteClick = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  const handleCompletePurchase = (price: number) => {
    if (selectedItemId) {
      onComplete(selectedItemId, price);
      setSelectedItemId(null);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
          <p className="text-gray-500">Click "Add Item" to start building your grocery list</p>
        </CardContent>
      </Card>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[category] || categoryColors['Other']}`}>
              {category}
            </span>
            <span className="text-sm text-gray-500">({categoryItems.length})</span>
          </h3>

          <div className="space-y-2">
            {categoryItems.map((item) => (
              <Card
                key={item.id}
                className={item.claimedBy ? 'border-2 border-emerald-200 bg-emerald-50' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                        <span className="text-gray-500">× {item.quantity}</span>
                        {item.claimedBy && (
                          <Chip
                            icon={<Hand className="w-3 h-3" />}
                            label={item.claimedById === currentUserId ? "You've got it!" : "Claimed"}
                            size="small"
                            className="bg-emerald-500 text-white"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Added by {item.addedBy}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.claimedById === currentUserId ? (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            className="bg-green-500 hover:bg-green-600"
                            startIcon={<Check className="w-4 h-4" />}
                            onClick={() => handleCompleteClick(item.id)}
                          >
                            Purchased
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onClaim(item.id)}
                          >
                            Unclaim
                          </Button>
                        </>
                      ) : !item.claimedBy ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Hand className="w-4 h-4" />}
                          onClick={() => onClaim(item.id)}
                        >
                          I've got it!
                        </Button>
                      ) : null}

                      <IconButton
                        size="small"
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <CompletePurchaseDialog
        open={!!selectedItemId}
        itemName={selectedItem?.name || ''}
        onClose={() => setSelectedItemId(null)}
        onComplete={handleCompletePurchase}
      />
    </div>
  );
}
