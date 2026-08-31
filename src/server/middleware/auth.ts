import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { dataStore } from '../services/dataStore.ts';
import { User, UserRole } from '../../types/index.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Configure JWT_SECRET in Render/local .env for stable sessions across restarts.
// A process-local random fallback keeps the demo usable when the variable is omitted.
const JWT_SECRET = process.env.JWT_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

export function signToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      userId: user.userId,
      role: user.role,
      phone: user.phone,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = dataStore.getUserById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User session expired or invalid.',
        code: 'USER_NOT_FOUND',
      });
      return;
    }
    req.user = user;
    next();
  } catch (_err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      code: 'INVALID_TOKEN',
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${allowedRoles.join('/')} accounts. Your role is '${req.user.role}'.`,
        code: 'FORBIDDEN_ROLE',
      });
      return;
    }

    next();
  };
}
