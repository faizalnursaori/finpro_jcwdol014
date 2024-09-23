import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

export interface AuthenticatedRequest extends Request {
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
  // Extract the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Get the token from the Authorization header (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and decode it
    const secret = process.env.JWT_SECRET || 'H3LL0_FINPR0';
    const decoded = jwt.verify(token, secret);

    // Save the decoded token in req.user for use in next middleware/routes
    console.log('Decoded token', decoded);
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (err) {
    // If verification fails, send a 403 Forbidden response
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function AdminGuard(req: any, res: Response, next: NextFunction) {
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
