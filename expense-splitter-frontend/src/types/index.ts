// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthResponse {
  user: User;
  access_token: string;
}

// Group types
export enum GroupRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: string;
  user?: User;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  currency: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  members?: GroupMember[];
  expenses?: Expense[];
}

// Expense types
export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
  createdAt: string;
  user?: User;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category?: string;
  date: string;
  paidById: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  paidBy?: User;
  group?: Group;
  splits?: ExpenseSplit[];
}

// Balance types
export interface UserBalance {
  userId: string;
  username: string;
  fullName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}

export interface SimplifiedDebt {
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  amount: number;
}

export interface GroupBalance {
  groupId: string;
  groupName: string;
  currency: string;
  userBalances: UserBalance[];
  simplifiedDebts: SimplifiedDebt[];
}
