import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import type { User } from '../types';
import { useAuthStore } from '../stores/authStore';

// 日本時間に変換する関数
const toJST = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
};

export default function WorkerList() {
  const [selectedWorker, setSelectedWorker] = React.useState<User | null>(null);
  const { users } = useAuthStore();
  
  // Filter workers from users
  const workers = React.useMemo(() => 
    Object.values(users).filter(user => user.role === 'worker'),
    [users]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ワーカー一覧</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名前
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保有ポイント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終ログイン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={worker.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.email}`}
                        alt={worker.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {worker.points?.toLocaleString() ?? 0} P
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.lastLogin && format(toJST(worker.lastLogin), 'yyyy年M月d日 HH:mm', { locale: ja })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedWorker(worker)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ワーカー詳細</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">名前</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWorker.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">メールアドレス</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWorker.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">電話番号</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.phoneNumber || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">生年月日</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.birthDate || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500">住所</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.address || '-'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">銀行口座情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">銀行名</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.bankInfo?.bankName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">支店名</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.bankInfo?.branchName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">口座種別</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.bankInfo?.accountType || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">口座番号</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.bankInfo?.accountNumber || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500">口座名義</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWorker.profile?.bankInfo?.accountHolder || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}