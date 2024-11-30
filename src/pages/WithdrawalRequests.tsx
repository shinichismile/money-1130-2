import React, { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const withdrawalSchema = z.object({
  amount: z.number()
    .min(1000, '最低出金額は1,000Pです')
    .max(1000000, '出金額が上限を超えています'),
  paymentMethod: z.enum(['bank', 'crypto', 'paypay'], {
    required_error: '出金方法を選択してください',
  }),
});

type WithdrawalForm = z.infer<typeof withdrawalSchema>;

const withdrawalHistory: any[] = [];

export default function WithdrawalRequests() {
  const user = useAuthStore(state => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 1000,
      paymentMethod: 'bank',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  const handleWithdraw = async (data: WithdrawalForm) => {
    setIsSubmitting(true);
    try {
      // バリデーション
      const profile = user?.profile;
      if (!profile) {
        throw new Error('プロフィール情報が設定されていません');
      }

      switch (data.paymentMethod) {
        case 'bank':
          if (!profile.bankInfo?.bankName || !profile.bankInfo?.accountNumber) {
            throw new Error('銀行口座情報を設定してください');
          }
          break;
        case 'crypto':
          if (!profile.cryptoAddress) {
            throw new Error('仮想通貨受け取りアドレスを設定してください');
          }
          break;
        case 'paypay':
          if (!profile.payPayId) {
            throw new Error('PayPay IDを設定してください');
          }
          break;
      }

      // 出金処理（実際にはここでAPIリクエストなどを行う）
      toast.success('出金申請を受け付けました');
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '出金申請に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodHelp = () => {
    switch (selectedPaymentMethod) {
      case 'bank':
        return user?.profile?.bankInfo ? 
          `${user.profile.bankInfo.bankName} ${user.profile.bankInfo.branchName} ${user.profile.bankInfo.accountType} ${user.profile.bankInfo.accountNumber}` :
          '銀行口座情報が未設定です';
      case 'crypto':
        return user?.profile?.cryptoAddress || '仮想通貨アドレスが未設定です';
      case 'paypay':
        return user?.profile?.payPayId || 'PayPay IDが未設定です';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === 'worker' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">新規出金申請</h2>
          <form onSubmit={handleSubmit(handleWithdraw)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">出金金額</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="100"
                    {...register('amount', { valueAsNumber: true })}
                    className="form-input pr-8"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">P</span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="form-error">{errors.amount.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">最低出金額: 1,000P</p>
              </div>

              <div>
                <label className="form-label">出金方法</label>
                <select
                  {...register('paymentMethod')}
                  className="form-input"
                >
                  <option value="bank">銀行振込</option>
                  <option value="crypto">仮想通貨</option>
                  <option value="paypay">PayPay</option>
                </select>
                {errors.paymentMethod && (
                  <p className="form-error">{errors.paymentMethod.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">{getPaymentMethodHelp()}</p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? '処理中...' : '出金を申請する'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">出金履歴</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出金方法
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    履歴はありません
                  </td>
                </tr>
              ) : (
                withdrawalHistory.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(withdrawal.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.amount.toLocaleString()} P
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.paymentMethod === 'bank' && '銀行振込'}
                      {withdrawal.paymentMethod === 'crypto' && '仮想通貨'}
                      {withdrawal.paymentMethod === 'paypay' && 'PayPay'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {withdrawal.status === 'completed' ? '完了' : '処理中'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}