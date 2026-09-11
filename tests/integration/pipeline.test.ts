import { describe, test, expect } from '@jest/globals';
import { ComboService } from '../../apps/api/src/modules/combo/comboService';

describe('Gnonsky Bet AI End-to-End Pipeline Integration Test', () => {
  test('Executes daily pipeline successfully and returns a validated combo or NO_COMBO', async () => {
    const targetDate = '2026-09-11';
    const result = await ComboService.runDailyPipeline(targetDate);

    expect(result).toBeDefined();
    expect(result.combo).toBeDefined();
    expect(['PUBLISHED', 'NO_COMBO']).toContain(result.combo.status);

    if (result.combo.status === 'PUBLISHED') {
      expect(result.combo.selections.length).toBeGreaterThanOrEqual(3);
      expect(result.combo.selections.length).toBeLessThanOrEqual(5);
      expect(result.combo.total_odds).toBeGreaterThanOrEqual(1.25);
      
      // Ensure unique competitions
      const comps = result.combo.selections.map(s => s.competition.toLowerCase());
      const uniqueComps = new Set(comps);
      expect(uniqueComps.size).toBe(comps.length);
    }
  }, 20000);
});

