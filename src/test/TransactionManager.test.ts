import { LedgerStateMachine } from '../services/LedgerStateMachine';
import { TransactionManager } from '../services/TransactionManager';
import { LineItem, Transaction } from '../types/transaction.type';
import { randomUUID } from 'crypto';

const items: LineItem[] = [
  {
    itemId: 'item-12345',
    description: 'Ice Americano',
    price: 5.62,
    qty: 3,
  },
  {
    itemId: 'item-12346',
    description: 'Orange Juice',
    price: 3.24,
    qty: 1,
  },
  {
    itemId: 'item-12347',
    description: 'Carrot Cake',
    price: 5.17,
    qty: 2,
  },
];

describe('TransactionManager.ts event handler', () => {
  test('TransactionManager Transaction Initiate', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    expect(
      transactionMgr.initiateTransaction('SALE', 'CASH', items, null)
    ).not.toBe(null);
  });

  test('TransactionManager Transaction Run Sale', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    const trnx: Transaction | null = transactionMgr.initiateTransaction(
      'SALE',
      'CASH',
      items,
      null
    );
    transactionMgr.runTransaction(trnx!);
    expect(transactionMgr.getTransactionInfo(trnx!.id)).toStrictEqual({
      id: trnx!.id,
      type: 'SALE',
      state: 'POSTED',
      parentTransactionId: null,
      items: [
        {
          itemId: 'item-12345',
          description: 'Ice Americano',
          price: 5.62,
          qty: 3,
        },
        {
          itemId: 'item-12346',
          description: 'Orange Juice',
          price: 3.24,
          qty: 1,
        },
        {
          itemId: 'item-12347',
          description: 'Carrot Cake',
          price: 5.17,
          qty: 2,
        },
      ],
      subtotalBeforeTax: 30.44,
      totalBeforeRounding: 30.44,
      paymentMethod: 'CASH',
      roundedCashAmount: 30.45,
      roundingDifference: -0.01,
      createdAt: new Date().toISOString().split('T')[0],
      postedAt: new Date().toISOString().split('T')[0],
    });
  });

  test('TransactionManager Transaction Run Rufund Invalid Parent Transaction Id', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    const trnx: Transaction | null = transactionMgr.initiateTransaction(
      'SALE',
      'CASH',
      items,
      null
    );
    transactionMgr.runTransaction(trnx!);

    expect(() =>
      transactionMgr.initiateTransaction('REFUND', 'CASH', [], null)
    ).toThrow();
  });

  test('TransactionManager Transaction Run Rufund', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    const trnx: Transaction | null = transactionMgr.initiateTransaction(
      'SALE',
      'CASH',
      items,
      null
    );
    transactionMgr.runTransaction(trnx!);

    const refund_trnx: Transaction | null = transactionMgr.initiateTransaction(
      'REFUND',
      'CASH',
      [],
      trnx?.id
    );
    transactionMgr.runTransaction(refund_trnx!);
    expect(transactionMgr.getTransactionInfo(refund_trnx!.id)).toStrictEqual({
      id: refund_trnx?.id,
      type: 'REFUND',
      state: 'POSTED',
      parentTransactionId: trnx?.id,
      items: [
        {
          itemId: 'item-12345',
          description: 'Ice Americano',
          price: 5.62,
          qty: 3,
        },
        {
          itemId: 'item-12346',
          description: 'Orange Juice',
          price: 3.24,
          qty: 1,
        },
        {
          itemId: 'item-12347',
          description: 'Carrot Cake',
          price: 5.17,
          qty: 2,
        },
      ],
      subtotalBeforeTax: -30.44,
      totalBeforeRounding: -30.44,
      paymentMethod: 'CASH',
      roundedCashAmount: -30.45,
      roundingDifference: -0.01,
      createdAt: new Date().toISOString().split('T')[0],
      postedAt: new Date().toISOString().split('T')[0],
    });
  });

  test('TransactionManager Cancel Transaction', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    const trnx: Transaction | null = transactionMgr.initiateTransaction(
      'SALE',
      'CASH',
      items,
      null
    );

    transactionMgr.cancelTransaction(trnx?.id!);
    // Enable cancel only DRAFT and CALCULATED state
    expect(() => transactionMgr.getTransactionInfo(trnx!.id)).toThrow();
  });

  test('TransactionManager Get Daily Summary', () => {
    const transactionMgr: TransactionManager = TransactionManager.getInstance();
    const trnx: Transaction | null = transactionMgr.initiateTransaction(
      'SALE',
      'CASH',
      items,
      null
    );
    transactionMgr.runTransaction(trnx!);

    expect(
      transactionMgr.getDailySummary(new Date().toISOString().split('T')[0])
    ).toStrictEqual({
      date: new Date().toISOString().split('T')[0],
      totalSalesBeforeRounding: 121.76,
      totalRefundsBeforeRounding: -30.44,
      netSystemAmount: 91.32,
      cashInOutNet: 91.35,
      saleRoundingDifferenceTotal: 0.01,
      refundRoundingDifferenceTotal: 0,
      totalRoundingImpact: 0.01,
      expectedCashInDrawerChange: 91.33,
    });
  });
});
