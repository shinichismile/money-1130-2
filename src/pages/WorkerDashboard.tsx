import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, ArrowUpRight, Trophy } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePointStore } from '../stores/pointStore';

export default function WorkerDashboard() {
  const user = useAuthStore(state => state.user);
  const transactions = usePointStore(state => state.transactions);

  // Calculate weekly points and comparison
  const { weeklyPoints, lastWeekPoints, weeklyData } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const thisWeekTransactions = transactions.filter(t => 
      t.workerId === user?.id &&
      isWithinInterval(new Date(t.timestamp), { start: weekStart, end: weekEnd })
    );

    const lastWeekTransactions = transactions.filter(t => 
      t.workerId === user?.id &&
      isWithinInterval(new Date(t.timestamp), { start: lastWeekStart, end: lastWeekEnd })
    );

    const weeklyPoints = thisWeekTransactions.reduce((sum, t) => 
      sum + (t.type === 'add' ? t.amount : -t.amount), 0);

    const lastWeekPoints = lastWeekTransactions.reduce((sum, t) => 
      sum + (t.type === 'add' ? t.amount : -t.amount), 0);

    // Create weekly data for chart
    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const weeklyData = days.map(day => ({
      name: day,
      points: thisWeekTransactions
        .filter(t => format(new Date(t.timestamp), 'E', { locale: ja }) === day)
        .reduce((sum, t) => sum + (t.type === 'add' ? t.amount : -t.amount), 0)
    }));

    return { weeklyPoints, lastWeekPoints, weeklyData };
  }, [transactions, user?.id]);

  // Calculate week-over-week change percentage
  const weekOverWeekChange = lastWeekPoints === 0 
    ? 0 
    : ((weeklyPoints - lastWeekPoints) / lastWeekPoints) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Wallet className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">保有ポイント</p>
              <p className="text-2xl font-bold text-gray-900">{user?.points?.toLocaleString() ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今週の獲得</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">先週比</p>
              <p className="text-2xl font-bold text-gray-900">
                {weekOverWeekChange > 0 ? '+' : ''}{weekOverWeekChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">ランキング</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">週間獲得ポイント</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="points" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">最近の取引</h2>
          <div className="space-y-3">
            {transactions
              .filter(t => t.workerId === user?.id)
              .slice(0, 5)
              .map((transaction) => (
                <div key={transaction.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.reason}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(transaction.timestamp), 'M月d日 HH:mm', { locale: ja })}
                    </p>
                  </div>
                  <div className={`text-sm font-bold ${
                    transaction.type === 'add'
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  } px-3 py-1 rounded-full`}>
                    {transaction.type === 'add' ? '+' : '-'}{transaction.amount.toLocaleString()} P
                  </div>
                </div>
              ))}
            {transactions.filter(t => t.workerId === user?.id).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                取引履歴はありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}