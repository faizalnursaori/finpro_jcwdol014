import express from 'express';
import { updateUser, getUserByEmail, updateUserPassword, updateUserByToken, resetUserPassword, createUser } from '@/controllers/user.controller';

const router = express.Router();

router.post('/', createUser)
router.put('/:id', updateUser)
router.put('/password/:id', updateUserPassword)
router.put('/register/:token', updateUserByToken)
router.put('/reset-password/:token', resetUserPassword)
router.get('/:email', getUserByEmail)

export default router;
