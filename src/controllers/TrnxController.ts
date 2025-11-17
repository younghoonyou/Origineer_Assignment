import { Request, Response } from 'express';
import { TransactionManager } from '../services/TransactionManager';
import { LineItem, Transaction } from '../types/transaction.type';
export class TrnxContrller {
  private trnxManager: TransactionManager = TransactionManager.getInstance();
  async saleTrnx(req: Request, res: Response) {
    try {
      const { items, method } = req.body as {
        items: LineItem[];
        method: 'CASH' | 'CARD';
      };

      const req_items: LineItem[] = items.map((item: LineItem) => ({
        itemId: String(item.itemId),
        description: String(item.description),
        price: Number(item.price),
        qty: Number(item.qty),
      }));

      const trnx: Transaction | null = this.trnxManager.initiateTransaction(
        'SALE',
        method,
        req_items
      );

      if (trnx === null) throw new Error('Fail to initiate Transaction');

      this.trnxManager.runTransaction(trnx);

      res.json({
        message: 'Transaction sale successfully done',
        tr_id: trnx.id,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to sale transaction' });
    }
  }
  async refundTrnx(req: Request, res: Response) {
    try {
      const { parentTransactionId } = req.body as {
        parentTransactionId: string;
      };

      const trnx: Transaction | null = this.trnxManager.initiateTransaction(
        'REFUND',
        'CARD',
        [],
        parentTransactionId
      );

      if (trnx === null) throw new Error('Fail to initiate Transaction');

      this.trnxManager.runTransaction(trnx);

      res.json({ message: 'Transaction refund successfully done' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to refund transaction' });
    }
  }
  async cancelTrnx(req: Request, res: Response) {
    try {
      const { id } = req.body as {
        id: string;
      };
      this.trnxManager.cancelTransaction(id);

      res.json({ message: 'Transaction cancel successfully done' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to cancel transaction' });
    }
  }

  async getTrnxInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction: Transaction = this.trnxManager.getTransactionInfo(id);
      res.json({ transaction });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get transaction info' });
    }
  }

  async getDailySummary(req: Request, res: Response) {
    try {
      const { date } = req.params as { date: string };
      if (!this.trnxManager.getDailySummary(date))
        return res.status(400).json({ message: 'Transaction not found' });
      res.status(200).json({ summary: this.trnxManager.getDailySummary(date) });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get transaction info' });
    }
  }
}
