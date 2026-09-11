import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  Logger.error('API_ERROR_HANDLER', `Unhandled exception: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack
  });

  res.status(err.status || 500).json({
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred processing your request',
    timestamp: new Date().toISOString()
  });
}

