import { Request, Response } from 'express';
import prisma from '@/prisma';
import jwt from 'jsonwebtoken';
import bcrypt, { genSalt } from 'bcrypt';
import { transporter } from '@/utils/auth.utils';
import { configDotenv } from 'dotenv';
import { Role } from '@prisma/client';

interface LoginPayload {
  userId: number;
  email: string;
  username: string;
  role: Role;
  iat: number;
  warehouseId?: number;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingVerifiedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingVerifiedUser) {
      return res.status(409).json({ message: 'User already registered.' });
    }

    const user = await prisma.user.create({
      data: {
        username: email,
        email,
        password: '',
        name: '',
        dob: null,
        mobileNumber: null,
        gender: null,
        carts: {
          create: {
            isActive: true,
          },
        },
      },
      include: {
        carts: true,
      },
    });

    const idToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      },
    );

    const url = `http://localhost:3000/register/set-user-data/${idToken}`;

    try {
      await transporter.sendMail({
        from: {
          name: 'Hemart',
          address: process.env.GMAIL_USER!,
        },
        to: email,
        subject: 'Confirmation Email',
        html: `Please click this link to complete your registration: <a href="${url}">${url}<a/>`,
      });
    } catch (error) {
      console.log('error sending an email: ', error);
    }

    res.status(201).json({
      message: 'Registration success',
      user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { warehouse: true },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid email/username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: 'Invalid email/username or password' });
    }

    const payload: LoginPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      iat: Date.now(),
    };

    // Add warehouseId to payload if user is an admin and has a warehouse
    if (user.role === 'ADMIN' && user.warehouse) {
      payload.warehouseId = user.warehouse.id;
    }
    console.log('User login payload:');
    console.log(`Role: ${payload.role}`);
    console.log(`WarehouseId: ${payload.warehouseId || 'Not assigned'}`);
    console.log('Full payload:', JSON.stringify(payload, null, 2));

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({ message: 'Login success', data: user, token });
  } catch (error) {
    console.error('Error login', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.provider === 'google' || user?.provider === 'github') {
      return res
        .status(404)
        .json({ message: 'Login with provider cannot reset password.' });
    }

    const idToken = jwt.sign({ id: user?.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const url = `http://localhost:3000/login/reset-password/${idToken}`;

    try {
      await transporter.sendMail({
        from: {
          name: 'Hemart',
          address: process.env.GMAIL_USER!,
        },
        to: email,
        subject: 'Reset Password Confirmation',
        html: `Please click this link to reset your password: <a href="${url}">${url}<a/>`,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Email not sent!' });
    }

    res.status(200).json({ message: 'Success requesting reset password.' });
  } catch (error) {
    res.status(404).json({ message: 'User not found!' });
  }
};
