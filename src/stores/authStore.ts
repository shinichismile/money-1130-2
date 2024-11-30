import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile } from '../types';

export const AUTH_CREDENTIALS = {
  'kkkk1111': 'kkkk1111',
  'kkkk2222': 'kkkk2222',
} as const;

interface AuthState {
  user: User | null;
  users: Record<string, User>;
  isAuthenticated: boolean;
  customIcon?: string;
  login: (user: Omit<User, 'password'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User & { profile: UserProfile }>) => void;
  updateIcon: (base64: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  updatePoints: (points: number) => void;
  updateUserPoints: (userId: string, points: number) => void;
  getUser: (userId: string) => User | null;
}

const INITIAL_USERS: Record<string, User> = {
  'kkkk1111': {
    id: 'kkkk1111',
    loginId: 'kkkk1111',
    name: '管理者',
    email: 'admin@pointmoney.com',
    role: 'admin',
    points: 0,
    status: 'active',
    joinedAt: '2024-01-01',
    totalEarned: 0,
  },
  'kkkk2222': {
    id: 'kkkk2222',
    loginId: 'kkkk2222',
    name: 'テストワーカー',
    email: 'worker@pointmoney.com',
    role: 'worker',
    points: 0,
    status: 'active',
    joinedAt: '2024-01-15',
    totalEarned: 0,
  },
};

const INITIAL_STATE = {
  user: null,
  users: INITIAL_USERS,
  isAuthenticated: false,
  customIcon: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      login: (userData) => {
        const currentUsers = get().users;
        const updatedUser = {
          ...currentUsers[userData.id],
          lastLogin: new Date().toISOString(),
        };
        
        set({ 
          user: updatedUser,
          users: {
            ...currentUsers,
            [userData.id]: updatedUser,
          },
          isAuthenticated: true,
        });
      },

      logout: () => set(INITIAL_STATE),

      updateProfile: (updates) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.users[state.user.id], ...updates };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updateIcon: (base64) => set({ customIcon: base64 }),

      updateAvatar: (avatarUrl) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.users[state.user.id], avatarUrl };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updatePoints: (points) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { 
            ...state.users[state.user.id], 
            points,
            totalEarned: state.users[state.user.id].totalEarned + points,
          };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updateUserPoints: (userId, points) =>
        set((state) => {
          const currentUser = state.users[userId];
          if (!currentUser) return state;

          const updatedUser = { 
            ...currentUser, 
            points: Math.max(0, points),
            totalEarned: currentUser.totalEarned + (points > currentUser.points ? points - currentUser.points : 0),
          };

          return {
            ...state,
            users: {
              ...state.users,
              [userId]: updatedUser,
            },
            user: state.user?.id === userId ? updatedUser : state.user,
          };
        }),

      getUser: (userId) => get().users[userId] || null,
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any) => {
        // Reset to initial state if the persisted state is invalid
        if (!persistedState || typeof persistedState !== 'object') {
          return INITIAL_STATE;
        }

        // Ensure users object contains all initial users
        const users = {
          ...INITIAL_USERS,
          ...persistedState.users,
        };

        // Ensure user roles are preserved
        Object.keys(INITIAL_USERS).forEach(id => {
          if (users[id]) {
            users[id].role = INITIAL_USERS[id].role;
          }
        });

        return {
          user: persistedState.user,
          users,
          isAuthenticated: persistedState.isAuthenticated ?? false,
          customIcon: persistedState.customIcon,
        };
      },
    }
  )
);