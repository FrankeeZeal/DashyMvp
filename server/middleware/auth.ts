import { Request, Response, NextFunction } from 'express';

// Simple middleware for MVP to handle auth
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // For MVP, we're allowing all requests through
  // In production, this would validate the session
  next();
};