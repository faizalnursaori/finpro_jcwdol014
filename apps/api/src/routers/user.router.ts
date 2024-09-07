import express from 'express';
import { updateUser, getUser, updateUserPassword, updateUserByToken, resetUserPassword } from '@/controllers/user.controller';

const router = express.Router();

router.put('/:id', updateUser)
router.put('/password/:id', updateUserPassword)
router.put('/register/:token', updateUserByToken)
router.put('/reset-password/:token', resetUserPassword)
router.get('/:id', getUser)

export default router;
