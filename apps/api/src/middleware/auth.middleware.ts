import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

interface AuthenticatedRequest extends Request {
  req: any;
  user?: {
    userId: any;
    email: any;
    username: any;
    role: any;
  };
}

export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const authToken = await getToken({req})
  if (authToken == null) return res.sendStatus(401);
  req.user = authToken
  next()
  
};

export async function AdminGuard(
  req: any,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

export async function SuperAdminGuard(
  req: any,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  if (req.user.role !== Role.SUPER_ADMIN) {
    return res.status(401).send('Unauthorized');
  }

  next();
}
