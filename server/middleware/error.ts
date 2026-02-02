import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 * Prevents internal system details from leaking to users.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { detail: err.message })
  });
};
