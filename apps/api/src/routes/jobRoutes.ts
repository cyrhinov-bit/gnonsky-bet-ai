import { Router, Request, Response, NextFunction } from 'express';
import { BetStudyCollector } from '../modules/betstudy/collector';
import { ComboService } from '../modules/combo/comboService';
import { ResultVerifier } from '../modules/results/resultVerifier';
import { adminAuthMiddleware } from '../middleware/auth';

export const jobRouter = Router();

jobRouter.use(adminAuthMiddleware);

/**
 * POST /api/jobs/collect-betstudy
 */
jobRouter.post('/collect-betstudy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.body;
    const matches = await BetStudyCollector.collectDailyMatches(date);
    res.json({
      success: true,
      collectedCount: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/jobs/build-combo
 */
jobRouter.post('/build-combo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.body;
    const result = await ComboService.runDailyPipeline(date);
    res.json({
      success: true,
      data: result.combo
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/jobs/verify-results
 */
jobRouter.post('/verify-results', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scores } = req.body;
    if (!scores || !Array.isArray(scores)) {
      return res.status(400).json({ success: false, message: 'Array of match scores required' });
    }
    const result = await ResultVerifier.verifyPendingResults(scores);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

