export type LedgerDirection = 'DEBIT' | 'CREDIT';
export interface LedgerEntry {
  transactionId: string;
  account: 'CASH_DRAWER' | 'SALES' | 'ROUNDING_GAIN_LOSS';
  amount: number; // positive number in dollars or cents
  direction: LedgerDirection;
}
export type LedgerBehavior =
  | 'ADD_ITEM'
  | 'CALCULATE_TOTALS'
  | 'APPLY_CASH_ROUNDING'
  | 'POST'
  | 'CANCEL';

export interface DailySummary {
  date: string;
  totalSalesBeforeRounding: number;
  totalRefundsBeforeRounding: number;
  netSystemAmount: number;
  cashInOutNet: number; // net movement in CASH_DRAWER
  saleRoundingDifferenceTotal: number;
  refundRoundingDifferenceTotal: number;
  totalRoundingImpact: number; // sale + refund rounding
  expectedCashInDrawerChange: number; // should match cashInOutNet
}

export type Handlers = {
  [K in LedgerBehavior]: (payload?: any) => any;
};
