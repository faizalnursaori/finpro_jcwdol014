import { Router } from 'express';

import {
  createVoucher,
  deleteVoucher,
  updateVoucher,
  getAllVouchers,
} from '@/controllers/voucher.controller';

const router = Router();

//get Warehouse
router.get('/', getAllVouchers);
router.post('/', createVoucher);
router.put('/', updateVoucher);
router.delete('/:id', deleteVoucher);

export const voucherRouter = router;