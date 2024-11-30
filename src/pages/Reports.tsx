import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { name: '月', points: 0 },
  { name: '火', points: 0 },
  { name: '水', points: 0 },
  { name: '木', points: 0 },
  { name: '金', points: 0 },
  { name: '土', points: 0 },
  { name: '日', points: 0 }
];

const categoryData = [
  { name: 'タスク完了', value: 0 },
  { name: 'プロジェクトボーナス', value: 0 },
  { name: '日次ボーナス', value: 0 },
  { name: '特別報酬', value: 0 }
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">週間獲得ポイント推移</h2>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">カテゴリー別獲得ポイント</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">月間サマリー</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm font-medium text-indigo-600">総獲得ポイント</p>
            <p className="mt-2 text-3xl font-bold text-indigo-900">0</p>
            <p className="mt-1 text-sm text-indigo-600">前月比 0%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">平均日次獲得</p>
            <p className="mt-2 text-3xl font-bold text-green-900">0</p>
            <p className="mt-1 text-sm text-green-600">目標達成率 0%</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm font-medium text-amber-600">最高日次獲得</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">0</p>
            <p className="mt-1 text-sm text-amber-600">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}