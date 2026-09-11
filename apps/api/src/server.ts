import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './config/env';
import { comboRouter } from './routes/comboRoutes';
import { adminRouter } from './routes/adminRoutes';
import { jobRouter } from './routes/jobRoutes';
import { errorHandler } from './middleware/errorHandler';
import { Logger } from './utils/logger';

const app = express();

// Enable Trust Proxy for Render / Heroku / Reverse Proxies
app.set('trust proxy', 1);

// Security & Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Relaxed Rate Limiting for API routes (2000 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Gnonsky Bet AI Backend',
    timestamp: new Date().toISOString(),
    environment: CONFIG.NODE_ENV
  });
});

// API Routes (Protected by generous rate limit)
app.use('/api', apiLimiter);
app.use('/api/combo', comboRouter);
app.use('/api/admin', adminRouter);
app.use('/api/jobs', jobRouter);

// Global Error Handler
app.use(errorHandler);

// Serve Static Web Frontend if available
const webDistPath = path.resolve(__dirname, '../../web/dist');
if (fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(CONFIG.PORT, () => {
    Logger.info('SERVER', `🚀 Gnonsky Bet AI Server running on port ${CONFIG.PORT} in ${CONFIG.NODE_ENV} mode`);
  });
}

export default app;

