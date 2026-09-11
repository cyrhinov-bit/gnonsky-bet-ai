import { Router, Request, Response } from 'express';
import { ComboService } from '../modules/combo/comboService';
import { BacktestEngine } from '../modules/backtest/backtestEngine';
import { adminAuthMiddleware } from '../middleware/auth';

export const adminRouter = Router();

// Apply admin protection to all administrative routes
adminRouter.use(adminAuthMiddleware);

/**
 * POST /api/admin/run-analysis
 * Triggers a manual end-to-end execution of the pipeline
 */
adminRouter.post('/run-analysis', async (req: Request, res: Response, next) => {
  try {
    const { date } = req.body;
    const result = await ComboService.runDailyPipeline(date);
    res.json({
      success: true,
      message: `Pipeline successfully executed for ${date || 'today'}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/candidates/:date
 */
adminRouter.get('/candidates/:date', (req: Request, res: Response) => {
  const date = req.params.date as string;
  const candidates = ComboService.getCandidatesForDate(date);
  res.json({
    success: true,
    count: candidates.length,
    data: candidates
  });
});

/**
 * GET /api/admin/performance
 * Returns backtesting and real yield metrics
 */
adminRouter.get('/performance', (req: Request, res: Response) => {
  const benchmark = BacktestEngine.getBenchmarkHistoricalData();
  res.json({
    success: true,
    data: benchmark
  });
});

