import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../config/env';

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-admin-key'] || req.query.admin_key;

  if (!apiKey || apiKey !== CONFIG.ADMIN_API_KEY) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or missing administrator authorization key'
    });
  }

  next();
}

