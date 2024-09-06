import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authorizationHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const verifiedUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload & {
      userId: number;
      email: string;
      username: string;
      role: string;
    };

    if (!verifiedUser) {
      return res.status(401).send('Unauthorized');
    }

    req.user = {
      userId: verifiedUser.id,
      email: verifiedUser.email,
      username: verifiedUser.username,
      role: verifiedUser.role,
    };

    next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
}
