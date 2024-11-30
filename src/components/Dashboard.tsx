import React from 'react';
import { User, PointTransaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, ArrowUpRight, Users, Bell } from 'lucide-react';

const mockUser: User = {
  id: '1',
  name: '山田 太郎',
  email: 'yamada@example.com',
  role: 'worker',
  points: 1500
};

const mockTransactions: PointTransaction[] = [
  { id: '1', userId: '1', amount: 500, type: 'earned', status: 'approved', timestamp: '2024年3月10日', description: 'タスク完了ボーナス' },
  { id: '2', userId: '1', amount: 300, type: 'earned', status: 'approved', timestamp: '2024年3月9日', description: 'プロジェクトマイルストーン達成' },
  { id: '3', userId: '1', amount: 200, type: 'withdrawn', status: 'pending', timestamp: '2024年3月8日', description: '出金リクエスト' }
];

const chartData = [
  { name: '月', points: 300 },
  { name: '火', points: 450 },
  { name: '水', points: 200 },
  { name: '木', points: 600 },
  { name: '金', points: 350 },
  { name: '土', points: 400 },
  { name: '日', points: 500 }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">PointManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">2</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  className="h-9 w-9 rounded-full ring-2 ring-indigo-600/20"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="プロフィール"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{mockUser.name}</span>
                  <span className="text-xs text-gray-500">ワーカー</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Wallet className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">保有ポイント</p>
                <p className="text-2xl font-bold text-gray-900">{mockUser.points.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">今週の獲得ポイント</p>
                <p className="text-2xl font-bold text-gray-900">2,800</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">総合ランキング</p>
                <p className="text-2xl font-bold text-gray-900">3位</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント履歴</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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

          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">最近の取引</h2>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                  </div>
                  <div className={`text-sm font-bold ${
                    transaction.type === 'earned' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  } px-3 py-1 rounded-full`}>
                    {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()} P
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}