type LedgerDirection = 'DEBIT' | 'CREDIT';
interface LedgerEntry {
  transactionId: string;
  account: 'CASH_DRAWER' | 'SALES' | 'ROUNDING_GAIN_LOSS';
  amount: number; // positive number in dollars or cents
  direction: LedgerDirection;
}
