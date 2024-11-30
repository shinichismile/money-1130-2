import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: 'bank' | 'paypal';
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
}

interface WithdrawalState {
  requests: WithdrawalRequest[];
  addRequest: (request: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => void;
  updateStatus: (id: string, status: WithdrawalRequest['status']) => void;
  clearRequests: () => void;
}

export const useWithdrawalStore = create<WithdrawalState>()(
  persist(
    (set) => ({
      requests: [],
      addRequest: (request) =>
        set((state) => ({
          requests: [
            {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              status: 'pending',
              ...request,
            },
            ...state.requests,
          ],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id ? { ...request, status } : request
          ),
        })),
      clearRequests: () => set({ requests: [] }),
    }),
    {
      name: 'withdrawal-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);