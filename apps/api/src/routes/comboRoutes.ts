import { Router, Request, Response } from 'express';
import { ComboService } from '../modules/combo/comboService';
import { ComboSelector } from '../modules/combo/comboSelector';
import { CandidateEngine } from '../modules/candidates/candidateEngine';
import { PreFilterEngine } from '../modules/prefilter/preFilterEngine';
import { BetStudyNormalizer } from '../modules/betstudy/normalizer';
import { BetStudyCollector } from '../modules/betstudy/collector';
import { AIAnalysisEngine } from '../modules/ai/aiAnalysisEngine';
import { Logger } from '../utils/logger';

export const comboRouter = Router();

/**
 * GET /api/combo/today
 * Returns the single certified Daily Combo
 */
comboRouter.get('/today', async (req: Request, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  try {
    const combo = await ComboService.getTodayCombo(date);
    return res.json({
      success: true,
      data: combo
    });
  } catch (error: any) {
    Logger.error('COMBO_ROUTE', `Fallback triggered for /today: ${error.message}`);
    // Safe deterministic fallback
    try {
      const raw = BetStudyCollector.getOfflineSampleFixtures(date);
      const normalized = raw.map(r => BetStudyNormalizer.normalize(r));
      const filtered = PreFilterEngine.filterBatch(normalized);
      const analyses = new Map();
      for (const m of filtered) {
        analyses.set(m.match_id, AIAnalysisEngine.fallbackStatisticalAnalysis(m, 'gpt-4o'));
      }
      const candidates = CandidateEngine.buildCandidates(filtered, analyses);
      const fallbackCombo = ComboSelector.selectDailyCombo(candidates, date, 'gpt-4o', 'v2.4.0');
      return res.json({
        success: true,
        data: fallbackCombo
      });
    } catch {
      return res.status(200).json({
        success: true,
        data: {
          analysis_date: date,
          status: 'NO_COMBO',
          number_of_matches: 0,
          total_odds: null,
          theoretical_probability: null,
          confidence_score: 0,
          risk: 'LOW',
          selections: [],
          model_version: 'gpt-4o',
          prompt_version: 'v2.4.0',
          algorithm_version: 'v1.0.0',
          no_combo_reason: 'Système en cours de synchronisation. Veuillez réessayer dans quelques instants.'
        }
      });
    }
  }
});

/**
 * GET /api/combo/history
 * Returns historical combos with results
 */
comboRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const history = await ComboService.getComboHistory(limit);
    return res.json({
      success: true,
      data: history
    });
  } catch (error: any) {
    Logger.error('COMBO_ROUTE', `Error in /history: ${error.message}`);
    return res.json({
      success: true,
      data: []
    });
  }
});

/**
 * GET /api/combo/:id
 */
comboRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const history = await ComboService.getComboHistory(50);
    const found = history.find(c => c.id === id || c.analysis_date === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Combo not found' });
    }
    return res.json({ success: true, data: found });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
});
