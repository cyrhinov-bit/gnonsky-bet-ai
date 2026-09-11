import { describe, test, expect } from '@jest/globals';
import { FinalComboValidator } from '../../apps/api/src/modules/validator/finalValidator';
import { DailyCombo } from '../../packages/types/src/index';

describe('FinalComboValidator Unit Tests', () => {
  test('Approves a perfectly valid combo', () => {
    const validCombo: DailyCombo = {
      analysis_date: '2026-09-11',
      status: 'PUBLISHED',
      number_of_matches: 3,
      total_odds: 3.49,
      theoretical_probability: 0.4268,
      confidence_score: 85,
      risk: 'MODERATE',
      model_version: 'gpt-4o',
      prompt_version: 'v2.4.0',
      algorithm_version: 'v1.0.0',
      selections: [
        {
          match_id: 'm1',
          home_team: 'Arsenal',
          away_team: 'Brighton',
          competition: 'Premier League',
          market: 'OVER_2_5',
          odds: 1.55,
          estimated_probability: 0.76,
          confidence_score: 88,
          selection_order: 1
        },
        {
          match_id: 'm2',
          home_team: 'Leverkusen',
          away_team: 'Frankfurt',
          competition: 'Bundesliga',
          market: 'OVER_2_5',
          odds: 1.48,
          estimated_probability: 0.78,
          confidence_score: 89,
          selection_order: 2
        },
        {
          match_id: 'm3',
          home_team: 'Villarreal',
          away_team: 'Sociedad',
          competition: 'La Liga',
          market: 'BTTS_YES',
          odds: 1.52,
          estimated_probability: 0.72,
          confidence_score: 82,
          selection_order: 3
        }
      ]
    };

    const validation = FinalComboValidator.validate(validCombo);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  test('Rejects combo if an odds is below 1.25', () => {
    const invalidCombo: DailyCombo = {
      analysis_date: '2026-09-11',
      status: 'PUBLISHED',
      number_of_matches: 3,
      total_odds: 2.50,
      theoretical_probability: 0.50,
      confidence_score: 80,
      risk: 'MODERATE',
      model_version: 'gpt-4o',
      prompt_version: 'v2.4.0',
      algorithm_version: 'v1.0.0',
      selections: [
        { match_id: 'm1', home_team: 'A', away_team: 'B', competition: 'L1', market: 'OVER_2_5', odds: 1.20, estimated_probability: 0.8, confidence_score: 80, selection_order: 1 },
        { match_id: 'm2', home_team: 'C', away_team: 'D', competition: 'L2', market: 'OVER_2_5', odds: 1.50, estimated_probability: 0.7, confidence_score: 80, selection_order: 2 },
        { match_id: 'm3', home_team: 'E', away_team: 'F', competition: 'L3', market: 'BTTS_YES', odds: 1.40, estimated_probability: 0.7, confidence_score: 80, selection_order: 3 }
      ]
    };

    const validation = FinalComboValidator.validate(invalidCombo);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some(e => e.includes('below 1.25'))).toBe(true);
  });
});

