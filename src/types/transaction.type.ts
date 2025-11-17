export type TransactionType = 'SALE' | 'REFUND';
export type TransactionState = 'DRAFT' | 'CALCULATED' | 'POSTED' | 'CANCELLED';
export interface LineItem {
  itemId: string;
  description: string;
  price: number; // before tax, per unit
  qty: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  state: TransactionState;
  parentTransactionId?: string | null; // for refunds referencing an original sale
  items: LineItem[];
  subtotalBeforeTax: number;
  totalBeforeRounding: number;
  paymentMethod: 'CASH' | 'CARD';
  roundedCashAmount: number; // actual cash paid/refunded
  roundingDifference: number; // totalBeforeRounding - roundedCashAmount
  createdAt: string;
  postedAt?: string | null;
}
