import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { dataStore } from '../services/dataStore.ts';
import { User, UserRole } from '../../types/index.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Secret used to sign/verify login tokens.
 * Reads JWT_SECRET from the environment (Render → Environment → JWT_SECRET).
 * If it is not configured we generate a random one per boot so the app still
 * works locally; note that sessions then do not survive a restart.
 */
const JWT_SECRET = (() => {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;

  const generated = crypto.randomBytes(48).toString('hex');
  console.warn(
    '[Kisan Mitra] JWT_SECRET is not set — generated an ephemeral secret for this process. ' +
      'Set JWT_SECRET in the environment to keep users logged in across restarts.'
  );
  return generated;
})();

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
  } catch (err: any) {
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
