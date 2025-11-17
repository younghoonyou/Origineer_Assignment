import { LedgerStateMachine } from '../services/LedgerStateMachine';
import { Transaction } from '../types/transaction.type';
import { randomUUID } from 'crypto';
describe('LedgerStateMachine.ts event handler', () => {
  test('LedgerStateMachine ADD_ITEM: DRAFT state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleDRAFTTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // ADD_ITEM allowed only in DRAFT
    expect(() =>
      ledgerStateMachine.handler['ADD_ITEM'](saleDRAFTTR)
    ).not.toThrow();
  });

  test('LedgerStateMachine ADD_ITEM: CALCULATED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleCALCULATEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CALCULATED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // ADD_ITEM allowed only in DRAFT
    expect(() =>
      ledgerStateMachine.handler['ADD_ITEM'](saleCALCULATEDTR)
    ).toThrow();
  });

  test('LedgerStateMachine ADD_ITEM: POSTED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const salePOSTEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'POSTED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // ADD_ITEM allowed only in DRAFT
    expect(() =>
      ledgerStateMachine.handler['ADD_ITEM'](salePOSTEDTR)
    ).toThrow();
  });

  test('LedgerStateMachine ADD_ITEM: CANCELLED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleCANCELLEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CANCELLED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // ADD_ITEM allowed only in DRAFT
    expect(() =>
      ledgerStateMachine.handler['ADD_ITEM'](saleCANCELLEDTR)
    ).toThrow();
  });

  test('LedgerStateMachine ADD_ITEM: Invalid TAX price', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleDRAFTTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: -14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // It is not allowed to add negative value of item
    expect(() => ledgerStateMachine.handler['ADD_ITEM'](saleDRAFTTR)).toThrow();
  });

  // ================= ADD_ITEM =================

  test('LedgerStateMachine CALCULATE_TOTALS: DRAFT state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleDRAFTTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CALCULATE_TOTALS allowed only in DRAFT to convert to CALCULATED
    expect(() =>
      ledgerStateMachine.handler['CALCULATE_TOTALS'](saleDRAFTTR)
    ).not.toThrow();
  });

  test('LedgerStateMachine CALCULATE_TOTALS: CALCULATED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleCALCULATEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CALCULATED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CALCULATE_TOTALS allowed only in DRAFT to convert to CALCULATED
    expect(() =>
      ledgerStateMachine.handler['CALCULATE_TOTALS'](saleCALCULATEDTR)
    ).toThrow();
  });

  test('LedgerStateMachine CALCULATE_TOTALS: POSTED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const salePOSTEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'POSTED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CALCULATE_TOTALS allowed only in DRAFT to convert to CALCULATED
    expect(() =>
      ledgerStateMachine.handler['CALCULATE_TOTALS'](salePOSTEDTR)
    ).toThrow();
  });

  test('LedgerStateMachine CALCULATE_TOTALS: CANCELLED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const saleCANCELLEDTR: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CANCELLED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CALCULATE_TOTALS allowed only in DRAFT to convert to CALCULATED
    expect(() =>
      ledgerStateMachine.handler['CALCULATE_TOTALS'](saleCANCELLEDTR)
    ).toThrow();
  });

  // ================= CALCULATE_TOTALS =================

  test('LedgerStateMachine APPLY_CASH_ROUNDING: PaymentMethod CASH', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const PaymentMethodCash: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CASH',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    ledgerStateMachine.handler['ADD_ITEM'](PaymentMethodCash);
    ledgerStateMachine.handler['CALCULATE_TOTALS'](PaymentMethodCash); // change state to CALCULATE

    // APPLY_CASH_ROUNDING allowed only in CALCULATE
    expect(() =>
      ledgerStateMachine.handler['APPLY_CASH_ROUNDING'](PaymentMethodCash)
    ).not.toThrow();
  });

  test('LedgerStateMachine APPLY_CASH_ROUNDING: PaymentMethod CARD', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const PaymentMethodCard: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    ledgerStateMachine.handler['ADD_ITEM'](PaymentMethodCard);
    ledgerStateMachine.handler['CALCULATE_TOTALS'](PaymentMethodCard);

    // APPLY_CASH_ROUNDING allowed only in CASH paymentMethod
    expect(() =>
      ledgerStateMachine.handler['APPLY_CASH_ROUNDING'](PaymentMethodCard)
    ).toThrow();
  });

  // ================= POST =================

  test('LedgerStateMachine POST: DRAFT state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const DraftTransaction: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'DRAFT',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // POST allowed only in CALCULATED state
    expect(() =>
      ledgerStateMachine.handler['POST'](DraftTransaction)
    ).toThrow();
  });

  test('LedgerStateMachine POST: CANCELLED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const CancelTransaction: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CANCELLED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // POST allowed only in CALCULATED state
    expect(() =>
      ledgerStateMachine.handler['POST'](CancelTransaction)
    ).toThrow();
  });

  test('LedgerStateMachine POST: POSTED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const CalculateTransaction: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'POSTED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 10.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 14.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // POST allowed only in CALCULATED state
    expect(() =>
      ledgerStateMachine.handler['POST'](CalculateTransaction)
    ).toThrow();
  });

  test('LedgerStateMachine POST: Invalid price', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const PaymentMethodCard: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CALCULATED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 14.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 12.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Validate price and rouding | totalBeforeRounding = roundedCashAmount + roundingDifference
    expect(() =>
      ledgerStateMachine.handler['POST'](PaymentMethodCard)
    ).toThrow();
  });

  // ================= CANCELLED =================

  test('LedgerStateMachine CANCEL: CANCELLED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const PaymentMethodCard: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'CANCELLED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 14.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 12.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CANCEL allowed only in DRAFT or CALCULATED state
    expect(() =>
      ledgerStateMachine.handler['CANCEL'](PaymentMethodCard)
    ).toThrow();
  });

  test('LedgerStateMachine CANCEL: POSTED state', () => {
    const ledgerStateMachine: LedgerStateMachine =
      LedgerStateMachine.getInstance();

    const PaymentMethodCard: Transaction = {
      id: `tx-${randomUUID()}`,
      type: 'SALE',
      state: 'POSTED',
      parentTransactionId: null,
      items: [],
      subtotalBeforeTax: 14.56,
      totalBeforeRounding: 14.56,
      paymentMethod: 'CARD',
      roundedCashAmount: 12.55,
      roundingDifference: 0.01,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // CANCEL allowed only in DRAFT or CALCULATED state
    expect(() =>
      ledgerStateMachine.handler['CANCEL'](PaymentMethodCard)
    ).toThrow();
  });
});
