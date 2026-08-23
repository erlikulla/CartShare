import { Card, CardContent } from '@mui/material';
import { Avatar } from '@mui/material';
import { Receipt, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { GroceryItem } from './GroceryDashboard';

interface BillsProps {
  purchaseHistory: GroceryItem[];
  currentUserId: number;
}

interface UserBalance {
  userId: number;
  userName: string;
  totalSpent: number;
  itemCount: number;
}

export function Bills({ purchaseHistory, currentUserId }: BillsProps) {
  // Calculate how much each person spent
  const userBalances = purchaseHistory.reduce((acc, item) => {
    const userId = item.purchasedById ?? item.addedById;
    const userName = item.purchasedBy || item.addedBy;

    if (!acc[userId]) {
      acc[userId] = {
        userId,
        userName,
        totalSpent: 0,
        itemCount: 0,
      };
    }

    acc[userId].totalSpent += item.price || 0;
    acc[userId].itemCount += 1;

    return acc;
  }, {} as Record<number, UserBalance>);

  const balanceArray = Object.values(userBalances);
  const totalSpent = balanceArray.reduce((sum, user) => sum + user.totalSpent, 0);
  const numPeople = balanceArray.length || 1;
  const fairShare = totalSpent / numPeople;

  // Calculate who owes whom
  const settlements = balanceArray.map(user => ({
    ...user,
    balance: user.totalSpent - fairShare,
  }));

  const currentUserBalance = settlements.find(s => s.userId === currentUserId);

  if (purchaseHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
          <p className="text-gray-500">Purchase items to start tracking bills</p>
        </CardContent>
      </Card>
    );
  }

  const getBalanceIcon = (balance: number) => {
    if (balance > 0.01) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (balance < -0.01) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0.01) return 'text-green-600';
    if (balance < -0.01) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceText = (balance: number, isCurrentUser: boolean) => {
    if (Math.abs(balance) < 0.01) return 'All settled up!';
    if (balance > 0) {
      return isCurrentUser ? 'You should receive' : 'Should receive';
    }
    return isCurrentUser ? 'You owe' : 'Owes';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bills & Settlements</h2>
        <p className="text-gray-600 mt-1">
          Total spent: ${totalSpent.toFixed(2)} • Fair share: ${fairShare.toFixed(2)} per person
        </p>
      </div>

      {/* Current User Summary */}
      {currentUserBalance && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 bg-emerald-500">
                  {currentUserBalance.userName.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Balance</h3>
                  <p className="text-sm text-gray-600">
                    You spent ${currentUserBalance.totalSpent.toFixed(2)} on {currentUserBalance.itemCount} {currentUserBalance.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {getBalanceIcon(currentUserBalance.balance)}
                  <span className={`text-2xl font-bold ${getBalanceColor(currentUserBalance.balance)}`}>
                    ${Math.abs(currentUserBalance.balance).toFixed(2)}
                  </span>
                </div>
                <p className={`text-sm font-medium ${getBalanceColor(currentUserBalance.balance)}`}>
                  {getBalanceText(currentUserBalance.balance, true)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All User Balances */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Everyone's Balance</h3>
        <div className="space-y-3">
          {settlements.map((settlement) => {
            const isCurrentUser = settlement.userId === currentUserId;

            return (
              <Card key={settlement.userId} className={isCurrentUser ? 'border-2 border-emerald-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className={isCurrentUser ? 'bg-emerald-500' : 'bg-gray-400'}>
                        {settlement.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {settlement.userName} {isCurrentUser && '(You)'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Spent ${settlement.totalSpent.toFixed(2)} on {settlement.itemCount} {settlement.itemCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {getBalanceIcon(settlement.balance)}
                        <span className={`text-lg font-semibold ${getBalanceColor(settlement.balance)}`}>
                          ${Math.abs(settlement.balance).toFixed(2)}
                        </span>
                      </div>
                      <p className={`text-xs ${getBalanceColor(settlement.balance)}`}>
                        {getBalanceText(settlement.balance, isCurrentUser)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Settlement Suggestions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Settle Up</h3>
          <div className="space-y-2">
            {settlements
              .filter(s => s.balance < -0.01)
              .map(debtor => {
                const creditor = settlements.find(s => s.balance > 0.01);
                if (!creditor) return null;

                const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

                return (
                  <div key={debtor.userId} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{debtor.userName}</span>
                    <span className="text-gray-600">pays</span>
                    <span className="font-medium">{creditor.userName}</span>
                    <span className="font-bold text-blue-600">${amount.toFixed(2)}</span>
                  </div>
                );
              })}
            {settlements.every(s => Math.abs(s.balance) < 0.01) && (
              <p className="text-gray-600">Everyone is settled up! 🎉</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

