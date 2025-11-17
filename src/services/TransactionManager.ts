import { TransactionType, Transaction, LineItem } from 'types/transaction.type';
import { DailySummary } from 'types/ledger.type';
import { LedgerStateMachine } from './LedgerStateMachine';
import { randomUUID } from 'crypto';
import { roundCash } from '../utils/math';

export class TransactionManager {
  private static instance: TransactionManager;
  private ledgerManager: LedgerStateMachine = LedgerStateMachine.getInstance();

  // singleton class
  static getInstance(): TransactionManager {
    if (!this.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  public initiateTransaction(
    type: TransactionType,
    method: 'CASH' | 'CARD',
    items: LineItem[],
    parentTransactionId: string | null = null
  ): Transaction | null {
    let trnx: Transaction | null = null;

    if (type === 'REFUND') {
      if (!parentTransactionId) throw new Error('Fail to initiate transaction');
      const parentTr =
        this.ledgerManager.getTransactionInfo(parentTransactionId);

      trnx = {
        id: `tx-${randomUUID()}`,
        type,
        state: 'DRAFT', // init state
        parentTransactionId,
        items: parentTr.items,
        subtotalBeforeTax: parentTr.subtotalBeforeTax,
        totalBeforeRounding: parentTr.totalBeforeRounding,
        paymentMethod: parentTr.paymentMethod,
        roundedCashAmount: parentTr.roundedCashAmount,
        roundingDifference: parentTr.roundingDifference,
        createdAt: new Date().toISOString().split('T')[0],
      };
    } else if (type === 'SALE') {
      if (!items || !method) throw new Error('Fail to initiate transaction');
      const totalBeforeRounding = items.reduce(
        (amount: number, item: LineItem) => {
          return amount + Number(item.price * item.qty);
        },
        0
      );

      trnx = {
        id: `tx-${randomUUID()}`,
        type,
        state: 'DRAFT', // init state
        parentTransactionId,
        items,
        subtotalBeforeTax: totalBeforeRounding,
        totalBeforeRounding,
        paymentMethod: method || 'CASH',
        roundedCashAmount: roundCash(totalBeforeRounding),
        roundingDifference:
          Math.round(
            (totalBeforeRounding - roundCash(totalBeforeRounding)) * 100
          ) / 100,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    this.ledgerManager.handler['ADD_ITEM'](trnx);

    return trnx;
  }

  public async runTransaction(trnx: Transaction) {
    try {
      try {
        this.ledgerManager.handler['CALCULATE_TOTALS'](trnx);

        if (trnx.paymentMethod === 'CASH')
          this.ledgerManager.handler['APPLY_CASH_ROUNDING'](trnx);

        this.ledgerManager.handler['POST'](trnx);
      } catch (error: any) {
        console.error(error);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  public cancelTransaction(id: string): void {
    this.ledgerManager.handler['CANCEL'](id);
  }

  public getTransactionInfo(id: string): Transaction {
    return this.ledgerManager.getTransactionInfo(id);
  }

  public getDailySummary(date: string): DailySummary | null {
    return this.ledgerManager.getDailySummary(date);
  }
}
