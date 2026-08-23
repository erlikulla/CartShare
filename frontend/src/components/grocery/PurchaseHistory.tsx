import { Card, CardContent } from '@mui/material';
import { Chip } from '@mui/material';
import { History, Check } from 'lucide-react';
import type { GroceryItem } from './GroceryDashboard';

interface PurchaseHistoryProps {
  history: GroceryItem[];
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

export function PurchaseHistory({ history }: PurchaseHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase history</h3>
          <p className="text-gray-500">Completed items will appear here</p>
        </CardContent>
      </Card>
    );
  }

  const totalSpent = history.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
        <p className="text-gray-600 mt-1">
          {history.length} {history.length === 1 ? 'item' : 'items'} purchased • Total: ${totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <Card key={item.id} className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                      <span className="text-gray-500">× {item.quantity}</span>
                      <Chip
                        label={item.category}
                        size="small"
                        className={categoryColors[item.category] || categoryColors['Other']}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Added by {item.addedBy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.price || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

