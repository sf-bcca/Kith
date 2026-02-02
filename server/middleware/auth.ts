import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
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
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.sub };
    next();
  } catch (err) {
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
