import express from 'express';
import {
  createAddress,
  getUserAddresses,
  deleteAddress,
  editAddress,
  getUserAddressById,
} from '@/controllers/address.controller';
import { authenticateToken2 } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate';
import { addressSchema, editAddressSchema } from '@/schema/address';

const router = express.Router();

router.post('/new', authenticateToken2, validate(addressSchema), createAddress);
router.get('/:id', authenticateToken2, getUserAddresses);
router.put(
  '/edit/:id',
  authenticateToken2,
  editAddress,
);
router.delete('/:id', authenticateToken2, deleteAddress);
router.get('/single/:id', authenticateToken2, getUserAddressById);

export default router;
