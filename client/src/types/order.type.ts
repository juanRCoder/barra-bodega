export type NewOrderItem =
  | {
      type: 'inventory';
      productAdminId: string;
      quantity: number;
    }
  | {
      type: 'manual';
      name: string;
      price: number;
      quantity: number;
    };

export type NewOrder = {
  accountId: string | null;
  items: NewOrderItem[];
};

export type OrderData = {
  id: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  total: number;
  accountId: string | null;
  createdAt: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    isManual: boolean;
  }[];
};
