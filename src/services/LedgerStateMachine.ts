import { Transaction } from 'types/transaction.type';
import { Handlers, LedgerEntry, DailySummary } from 'types/ledger.type';
import { roundCash } from '../utils/math';
export class LedgerStateMachine {
  private static instance: LedgerStateMachine;
  public handler: Handlers;

  // Instead of database In memory data
  private transactions: Map<
    string,
    { trnx: Transaction; ledger: LedgerEntry[] }
  > = new Map();

  constructor() {
    this.initializeLedgerEntry();
  }

  // singleton class
  static getInstance(): LedgerStateMachine {
    if (!this.instance) {
      LedgerStateMachine.instance = new LedgerStateMachine();
    }
    return LedgerStateMachine.instance;
  }

  private async initializeLedgerEntry() {
    this.handler = {
      ADD_ITEM: (tr: Transaction) => {
        if (tr.state !== 'DRAFT') throw new Error('Invalid transaction state');

        if (tr.subtotalBeforeTax < 0)
          throw new Error('Invalid transaction price');

        this.transactions.set(tr.id, { trnx: tr, ledger: [] });
      },

      APPLY_CASH_ROUNDING: (tr: Transaction) => {
        if (!this.transactions.get(tr.id))
          throw new Error('Fail to apply cash rounding');

        if (tr.state !== 'CALCULATED')
          throw new Error('Invalid transaction state');

        if (tr.paymentMethod !== 'CASH')
          throw new Error('Invalid payment method');

        tr.roundedCashAmount = roundCash(tr.totalBeforeRounding);
        tr.roundingDifference =
          Math.round(
            (tr.totalBeforeRounding - roundCash(tr.totalBeforeRounding)) * 100
          ) / 100;
      },

      CALCULATE_TOTALS: (tr: Transaction) => {
        // prev state
        if (tr.state !== 'DRAFT') throw new Error('Invalid transaction state');

        tr.state = 'CALCULATED';
      },

      POST: (tr: Transaction) => {
        if (tr.state !== 'CALCULATED')
          throw new Error('Invalid transaction state');

        if (
          tr.totalBeforeRounding !==
          Math.round((tr.roundedCashAmount + tr.roundingDifference) * 100) / 100
        )
          throw new Error('Invalidate transaction');

        let cashDrawer_ledger_amount = 0;
        let sales_ledger_amount = 0;
        const direction: 'CREDIT' | 'DEBIT' =
          tr.paymentMethod === 'CARD' ? 'CREDIT' : 'DEBIT';

        if (tr.type === 'SALE') cashDrawer_ledger_amount = tr.roundedCashAmount;
        else if (tr.type === 'REFUND')
          cashDrawer_ledger_amount = -tr.roundedCashAmount;

        if (tr.type === 'SALE') sales_ledger_amount = tr.totalBeforeRounding;
        else if (tr.type === 'REFUND')
          sales_ledger_amount = -tr.totalBeforeRounding;

        const roudingGainLoss_ledger: LedgerEntry = {
          transactionId: tr.id,
          account: 'ROUNDING_GAIN_LOSS',
          amount: tr.roundingDifference,
          direction,
        };

        const cashDrawer_ledger: LedgerEntry = {
          transactionId: tr.id,
          account: 'CASH_DRAWER',
          amount: cashDrawer_ledger_amount,
          direction,
        };

        const sales_ledger: LedgerEntry = {
          transactionId: tr.id,
          account: 'SALES',
          amount: sales_ledger_amount,
          direction,
        };

        this.transactions.get(tr.id)?.ledger.push(roudingGainLoss_ledger);
        this.transactions.get(tr.id)?.ledger.push(cashDrawer_ledger);
        this.transactions.get(tr.id)?.ledger.push(sales_ledger);

        tr.postedAt = new Date().toISOString().split('T')[0];
        tr.state = 'POSTED';
        tr.totalBeforeRounding = sales_ledger_amount;
        tr.roundedCashAmount = cashDrawer_ledger_amount;
        tr.subtotalBeforeTax = sales_ledger_amount;
      },

      CANCEL: (id: string) => {
        const tr: Transaction = this.transactions.get(id)?.trnx!;
        if (this.transactions.get(id)) this.transactions.delete(id);

        if (tr.state === 'POSTED' || tr.state === 'CANCELLED')
          throw new Error('Invalid transaction state');
      },
    };
  }

  public getTransactionInfo(id: string): Transaction {
    if (!this.transactions.get(id)) throw new Error('Not found transaction');
    return this.transactions.get(id)?.trnx!;
  }

  // Get daily summary from In-memory
  public getDailySummary(
    // transactions: Transaction[],
    // ledgerEntries: LedgerEntry[],
    date: string
  ): DailySummary | null {
    let totalSalesBeforeRounding = 0;
    let totalRefundsBeforeRounding = 0;
    let cashInOutNet = 0;

    const postedTransaction = [...this.transactions.values()].filter(
      (tr) => tr.trnx.postedAt === date
    );

    if (!postedTransaction.length) return null;
    for (const [key, value] of this.transactions) {
      if (value.trnx.postedAt !== date) continue; // accept only specific date

      if (value.trnx.type === 'SALE')
        totalSalesBeforeRounding += Number(value.trnx.totalBeforeRounding);
      if (value.trnx.type === 'REFUND')
        totalRefundsBeforeRounding += Number(value.trnx.totalBeforeRounding);

      const cash_drawer = value.ledger.filter(
        (entry) => entry.account === 'CASH_DRAWER'
      );
      if (cash_drawer.length) {
        cashInOutNet += cash_drawer.reduce(
          (amount: number, ledger: LedgerEntry) => {
            return amount + Number(ledger.amount);
          },
          0
        );
      }
    }

    const netSystemAmount =
      Math.round(
        (totalSalesBeforeRounding + totalRefundsBeforeRounding) * 100
      ) / 100;

    const saleRoundingDifferenceTotal =
      Math.round(
        (totalSalesBeforeRounding - roundCash(totalSalesBeforeRounding)) * 100
      ) / 100;
    const refundRoundingDifferenceTotal =
      Math.round(
        (totalRefundsBeforeRounding - roundCash(totalRefundsBeforeRounding)) *
          100
      ) / 100;

    const totalRoundingImpact =
      Math.round(
        (saleRoundingDifferenceTotal + refundRoundingDifferenceTotal) * 100
      ) / 100;

    const dailySummary: DailySummary = {
      date,
      totalSalesBeforeRounding,
      totalRefundsBeforeRounding,
      netSystemAmount,
      cashInOutNet,
      saleRoundingDifferenceTotal,
      refundRoundingDifferenceTotal,
      totalRoundingImpact,
      expectedCashInDrawerChange:
        Math.round((netSystemAmount + totalRoundingImpact) * 100) / 100,
    };

    return dailySummary;
  }
}
