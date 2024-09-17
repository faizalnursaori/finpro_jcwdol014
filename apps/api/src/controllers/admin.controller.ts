import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const user = await prisma.user.findMany({
      where: {
        isVerified: true,
        role: {
          in: ['USER'],
        },
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { name: { contains: search } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        mobileNumber: true,
        role: true,
        gender: true,
        dob: true,
        isVerified: true,
        image: true,
      },
      skip: skip,
      take: limit,
    });

    const totalVerifiedUsers = await prisma.user.count({
      where: {
        isVerified: true,
        role: {
          in: ['USER'],
        },
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { name: { contains: search } },
        ],
      },
    });

    res.status(200).json({
      user,
      meta: {
        totalItems: totalVerifiedUsers,
        totalPages: Math.ceil(totalVerifiedUsers / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const user = await prisma.user.findMany({
      where: {
        isVerified: true,
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { name: { contains: search } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        mobileNumber: true,
        role: true,
        isVerified: true,
        image: true,
      },
      skip: skip,
      take: limit,
    });

    const totalAdmin = await prisma.user.count({
      where: {
        isVerified: true,
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { name: { contains: search } },
        ],
      },
    });

    res.status(200).json({
      user,
      meta: {
        totalItems: totalAdmin,
        totalPages: Math.ceil(totalAdmin / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role, name, gender, mobileNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        email,
        role,
        gender,
        mobileNumber,
      },
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'Username or email already in use' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      message: 'Failed to delete user',
    });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    mobileNumber,
    role,
    isVerified,
    image,
    password,
  } = req.body;

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        mobileNumber,
        role,
        isVerified,
        image,
        password: hashedPassword,
      },
    });

    res.status(201).json({ ok: true, data: user });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'Username or email already in use' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
