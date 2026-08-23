import { Card, CardContent } from '@mui/material';
import { Button } from '@mui/material';
import {
  ShoppingCart,
  History,
  Receipt,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import type { GroceryItem } from './GroceryDashboard';

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

interface DashboardHomeProps {
  user: User;
  household: Household;
  items: GroceryItem[];
  purchaseHistory: GroceryItem[];
  onNavigate: (view: 'home' | 'list' | 'history' | 'bills') => void;
}

export function DashboardHome({
  user,
  household,
  items,
  purchaseHistory,
  onNavigate,
}: DashboardHomeProps) {
  const totalSpent = purchaseHistory.reduce((sum, item) => sum + (item.price || 0), 0);

  const userSpending = purchaseHistory
    .filter(item => item.purchasedById === user.id)
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const numPeople = new Set(purchaseHistory.map(item => item.purchasedById ?? item.addedById)).size || 1;
  const fairShare = totalSpent / numPeople;
  const userBalance = userSpending - fairShare;

  const recentPurchases = purchaseHistory.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
        <p className="text-gray-600 mt-1">Here's what's happening in {household.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('list')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('history')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('bills')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Your Balance</p>
                <p className={`text-3xl font-bold mt-1 ${
                  userBalance > 0.01 ? 'text-green-600' : userBalance < -0.01 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {userBalance > 0 ? '+' : ''}${userBalance.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Current Grocery List</h3>
            </div>
            {items.length === 0 ? (
              <p className="text-gray-500 mb-4">No items on the list yet</p>
            ) : (
              <div className="mb-4 space-y-2">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">+{items.length - 3} more items</p>
                )}
              </div>
            )}
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('list')}
            >
              View Full List
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Purchases</h3>
            </div>
            {recentPurchases.length === 0 ? (
              <p className="text-gray-500 mb-4">No purchases yet</p>
            ) : (
              <div className="mb-4 space-y-2">
                {recentPurchases.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-900 font-medium">${(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('history')}
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

