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

// Security & Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Gnonsky Bet AI Backend',
    timestamp: new Date().toISOString(),
    environment: CONFIG.NODE_ENV
  });
});

// API Routes
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

