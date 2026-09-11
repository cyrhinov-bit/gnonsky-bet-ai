import { describe, test, expect } from '@jest/globals';
import { ComboSelector } from '../../apps/api/src/modules/combo/comboSelector';
import { Candidate } from '../../packages/types/src/index';

describe('ComboSelector Unit Tests', () => {
  const createMockCandidate = (id: string, comp: string, prob = 0.75, odds = 1.50): Candidate => ({
    match_id: id,
    external_id: id,
    home_team: `Home ${id}`,
    away_team: `Away ${id}`,
    competition: comp,
    country: 'Test Country',
    match_date: '2026-09-11T18:00:00.000Z',
    recommended_market: 'OVER_2_5',
    odds,
    estimated_probability: prob,
    confidence_score: 85,
    risk: 'LOW',
    statistical_convergence: 0.9,
    scoring_breakdown: {
      goals_score: 80,
      market_score: 80,
      form_score: 80,
      home_away_score: 80,
      goals_avg_score: 80,
      convergence_score: 80,
      h2h_score: 80,
      data_quality_score: 100,
      penalties: 0,
      total_score: 85
    }
  });

  test('Emits NO_COMBO when less than 3 candidates are available', () => {
    const candidates = [
      createMockCandidate('m1', 'Premier League'),
      createMockCandidate('m2', 'La Liga')
    ];

    const result = ComboSelector.selectDailyCombo(candidates, '2026-09-11', 'gpt-4o', 'v2.4.0');
    expect(result.status).toBe('NO_COMBO');
    expect(result.selections.length).toBe(0);
    expect(result.no_combo_reason).toContain('Insufficient number of strong candidates');
  });

  test('Emits NO_COMBO when 3 candidates exist but 2 are in the same league', () => {
    const candidates = [
      createMockCandidate('m1', 'Premier League'),
      createMockCandidate('m2', 'Premier League'), // duplicate league
      createMockCandidate('m3', 'La Liga')
    ];

    const result = ComboSelector.selectDailyCombo(candidates, '2026-09-11', 'gpt-4o', 'v2.4.0');
    expect(result.status).toBe('NO_COMBO');
    expect(result.selections.length).toBe(0);
  });

  test('Emits PUBLISHED combo when 3 unique leagues are available', () => {
    const candidates = [
      createMockCandidate('m1', 'Premier League', 0.78, 1.55),
      createMockCandidate('m2', 'Bundesliga', 0.76, 1.48),
      createMockCandidate('m3', 'La Liga', 0.72, 1.52)
    ];

    const result = ComboSelector.selectDailyCombo(candidates, '2026-09-11', 'gpt-4o', 'v2.4.0');
    expect(result.status).toBe('PUBLISHED');
    expect(result.selections.length).toBe(3);
    expect(result.total_odds).toBeGreaterThan(3.4);
    expect(result.confidence_score).toBeGreaterThanOrEqual(80);
  });

  test('Never selects more than 5 matches even if more candidates are provided', () => {
    const candidates = [
      createMockCandidate('m1', 'Premier League'),
      createMockCandidate('m2', 'Bundesliga'),
      createMockCandidate('m3', 'La Liga'),
      createMockCandidate('m4', 'Serie A'),
      createMockCandidate('m5', 'Ligue 1'),
      createMockCandidate('m6', 'Eredivisie'),
      createMockCandidate('m7', 'Primeira Liga')
    ];

    const result = ComboSelector.selectDailyCombo(candidates, '2026-09-11', 'gpt-4o', 'v2.4.0');
    expect(result.status).toBe('PUBLISHED');
    expect(result.selections.length).toBe(5);
  });
});

