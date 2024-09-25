import express from 'express';
import { login, register, resetPassword  } from '../controllers/auth.controller';
import { validate } from '@/middleware/validate';
import { registerSchema } from '@/schema/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register',validate(registerSchema) ,register);
router.post('/user/reset-password', resetPassword);

export default router;
