import express from 'express';
import { updateUser, getUserByEmail, updateUserPassword, updateUserByToken, resetUserPassword, createUser, verifyUser,confirmation  } from '@/controllers/user.controller';
import upload from '@/middleware/uploader';
import { validate } from '@/middleware/validate';
import { setUserDataSchema, changePasswordSchema } from '@/schemas/user';
import { authenticateToken } from '@/middleware/auth.middleware';
const router = express.Router();

router.post('/', createUser)
router.put('/:id',upload.single("image"),authenticateToken,updateUser)
router.put('/password/:id',authenticateToken,validate(changePasswordSchema), updateUserPassword)
router.put('/register/:token',validate(setUserDataSchema) ,updateUserByToken)
router.put('/reset-password/:token',validate(changePasswordSchema) ,resetUserPassword)
router.get('/:email', getUserByEmail)
router.post('/verify', verifyUser)
router.get('/verify/:token', confirmation)

export default router;
