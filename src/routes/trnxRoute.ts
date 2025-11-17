import { Router } from 'express';
import { TrnxContrller } from '../controllers/TrnxController';

const router = Router();
const trnxController = new TrnxContrller();

router.post('/sale', trnxController.saleTrnx.bind(trnxController));
router.post('/refund', trnxController.refundTrnx.bind(trnxController));
router.post('/cancel', trnxController.cancelTrnx.bind(trnxController));
router.get('/:id', trnxController.getTrnxInfo.bind(trnxController));
router.get(
  '/summary/:date',
  trnxController.getDailySummary.bind(trnxController)
);

export default router;
