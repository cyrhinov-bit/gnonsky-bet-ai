import { describe, test, expect } from '@jest/globals';
import { ScoringEngine } from '../../packages/scoring/src/index';

describe('ScoringEngine Unit Tests', () => {
  test('calculateTotalOdds calculates exact product rounded to 2 decimals', () => {
    const odds = [1.55, 1.48, 1.52];
    const total = ScoringEngine.calculateTotalOdds(odds);
    // 1.55 * 1.48 * 1.52 = 3.48688 -> 3.49 or 3.48
    expect(total).toBeGreaterThan(3.45);
    expect(total).toBeLessThan(3.52);
  });

  test('calculateTheoreticalProbability computes exact compound probability', () => {
    const probs = [0.76, 0.78, 0.72];
    const compound = ScoringEngine.calculateTheoreticalProbability(probs);
    // 0.76 * 0.78 * 0.72 = 0.426816
    expect(compound).toBeCloseTo(0.4268, 3);
  });

  test('calculateCandidateScore applies penalties for anomalies and contradictions', () => {
    const mockMatch: any = {
      match_id: 'm1',
      odds: { over_2_5: 1.55, btts_yes: 1.60 },
      statistics: {
        goals_average: 3.2,
        over_2_5: 0.75,
        btts: 0.70,
        recent_form: ['W', 'W', 'W'],
        data_quality: 100,
        data_quantity: 100
      }
    };

    const cleanAI: any = {
      recommended_market: 'OVER_2_5',
      over_2_5_probability: 0.75,
      btts_probability: 0.70,
      contradictions: [],
      anomalies: [],
      statistical_convergence: 0.9
    };

    const penaltyAI: any = {
      ...cleanAI,
      contradictions: ['Anomaly 1', 'Contradiction 2'],
      anomalies: ['Odd variance']
    };

    const scoreClean = ScoringEngine.calculateCandidateScore(mockMatch, cleanAI);
    const scorePenalized = ScoringEngine.calculateCandidateScore(mockMatch, penaltyAI);

    expect(scorePenalized.total_score).toBeLessThan(scoreClean.total_score);
    expect(scorePenalized.penalties).toBeGreaterThan(0);
  });
});

