export type SalesPeriod = 'today' | 'week' | 'month';

export type SalesAnalytics = {
  period: SalesPeriod;
  ordersCount: number;
  unitsSold: number;
  salesAmount: number;
  collectedAmount: number;
  topProducts: {
    id: string;
    name: string;
    unitsSold: number;
    salesAmount: number;
  }[];
};
