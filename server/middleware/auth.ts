import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Middleware to verify JWT and protect routes.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret) as any;
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to prevent IDOR (Insecure Direct Object Reference).
 * Ensures that the authenticated user's ID matches the ID in the request parameters.
 */
export const authorizeOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ error: 'Access denied: unauthorized' });
  }

  next();
};

/**
 * Middleware to ensure the user is an admin or the owner.
 */
export const authorizeAdminOrOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role === 'admin' || req.user.id === id) {
    return next();
  }

  res.status(403).json({ error: 'Access denied: admin or owner role required' });
};

/**
 * Middleware to ensure the user is an admin.
 */
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: admin role required' });
  }

  next();
};
