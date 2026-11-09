export type AccountSummary = {
  id: string;
  name: string;
  phone: string;
  debt: number;
  totalPaid?: number;
  createdAt: string;
};

export type AccountMovement = {
  id: string;
  type: 'order' | 'payment';
  date: string;
  amount: number;
  items?: string[];
  status?: 'PAID' | 'PENDING' | 'CANCELLED';
};

export type AccountDetail = AccountSummary & {
  movements: AccountMovement[];
};

export type AccountsResponse = {
  accounts: (AccountSummary & { totalPaid: number })[];
  summary: {
    accountCount: number;
    debtCount: number;
    totalDebt: number;
    totalPaid: number;
  };
};

export type NewAccountForm = {
  name: string;
  phone: string;
};
