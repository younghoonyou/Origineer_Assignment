import { Router } from 'express';
import trnxRoutes from '../routes/trnxRoute';
const router = Router();

router.use('/trnx', trnxRoutes);

export default router;
