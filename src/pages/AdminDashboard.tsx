import React, { useState, useMemo } from 'react';
import { format, startOfMonth, subDays, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Wallet, TrendingUp, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Worker } from '../types';
import { useAuthStore } from '../stores/authStore';
import { usePointStore } from '../stores/pointStore';

export default function AdminDashboard() {
  const { user, users } = useAuthStore();
  const transactions = usePointStore((state) => state.transactions);
  const addTransaction = usePointStore((state) => state.addTransaction);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [pointAmount, setPointAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  // Filter workers from users
  const workers = useMemo(() => 
    Object.values(users).filter(user => user.role === 'worker') as Worker[],
    [users]
  );

  // 総発行ポイントと今月の発行ポイントを計算
  const { totalPoints, monthlyPoints } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    return transactions.reduce((acc, transaction) => {
      const amount = transaction.type === 'add' ? transaction.amount : -transaction.amount;
      acc.totalPoints += amount;

      // 今月の取引かどうかをチェック
      if (new Date(transaction.timestamp) >= monthStart) {
        acc.monthlyPoints += amount;
      }

      return acc;
    }, { totalPoints: 0, monthlyPoints: 0 });
  }, [transactions]);

  const handlePointOperation = () => {
    if (!selectedWorker || !pointAmount || !reason || !user) {
      toast.error('すべての項目を入力してください');
      return;
    }

    const amount = parseInt(pointAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('有効なポイント数を入力してください');
      return;
    }

    const currentPoints = selectedWorker.points || 0;
    const newPoints = operationType === 'add' 
      ? currentPoints + amount 
      : currentPoints - amount;

    if (newPoints < 0) {
      toast.error('ポイントが不足しています');
      return;
    }

    // Update points in auth store
    useAuthStore.getState().updateUserPoints(selectedWorker.id, newPoints);

    // Add transaction
    addTransaction({
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      adminId: user.id,
      adminName: user.name,
      amount,
      type: operationType,
      reason,
    });

    const operation = operationType === 'add' ? '付与' : '減算';
    toast.success(`${selectedWorker.name}さんのポイントを${amount.toLocaleString()}${operation}しました`);
    setSelectedWorker(null);
    setPointAmount('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">アクティブユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総発行ポイント</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今月の発行</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ワーカー
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedWorker?.id || ''}
              onChange={(e) => {
                const worker = workers.find(w => w.id === e.target.value);
                setSelectedWorker(worker || null);
              }}
            >
              <option value="">選択してください</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              操作タイプ
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as 'add' | 'subtract')}
            >
              <option value="add">付与</option>
              <option value="subtract">減算</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ポイント数
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={pointAmount}
                onChange={(e) => setPointAmount(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="100"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">P</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              理由
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={operationType === 'add' ? 'タスク完了ボーナス' : 'タスク未完了によるペナルティ'}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handlePointOperation}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              operationType === 'add' 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {operationType === 'add' ? (
              <Plus className="h-4 w-4 mr-2" />
            ) : (
              <Minus className="h-4 w-4 mr-2" />
            )}
            ポイントを{operationType === 'add' ? '付与' : '減算'}
          </button>
        </div>
      </div>
    </div>
  );
}