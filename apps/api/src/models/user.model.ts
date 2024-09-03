import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<User> => {
  return prisma.user.create({
    data: {
      ...userData,
      isVerified: false,
      role: 'USER',
    },
  });
};