export interface User {
  id: string;
  loginId: string;
  name: string;
  email: string;
  role: 'worker' | 'admin';
  points: number;
  avatarUrl?: string;
  profile?: UserProfile;
  lastLogin?: string;
}

export interface UserProfile {
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  bankInfo?: {
    bankName: string;
    branchName: string;
    accountType: '普通' | '当座';
    accountNumber: string;
    accountHolder: string;
  };
  cryptoAddress?: string;
  payPayId?: string;
}

export interface PointTransaction {
  id: string;
  workerId: string;
  workerName: string;
  adminId: string;
  adminName: string;
  amount: number;
  type: 'add' | 'subtract';
  timestamp: string;
  reason: string;
}

export interface Worker extends User {
  totalEarned: number;
  joinedAt: string;
  status: 'active' | 'inactive';
}