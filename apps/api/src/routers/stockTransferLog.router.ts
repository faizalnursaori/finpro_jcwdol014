import express from 'express';
import { createStockTransferLog } from '@/controllers/stockTransferLog.controller';

const router = express.Router();

router.post('/', createStockTransferLog);

export const stockTransferLogRouter = router;
