import { findByEmail, createUser } from '../models/user.model';
import { hashPassword, comparePasswords } from "../utils/auth.utils";
import jwt from 'jsonwebtoken';

export const login = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const user = await findByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' },
  );

  return token;
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<{ user: any; token: string } | null> => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await createUser({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' },
  );

  return { user: newUser, token };
};
