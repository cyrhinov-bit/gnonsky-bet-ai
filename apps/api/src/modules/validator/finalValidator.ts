import { DailyCombo } from '@football/types';
import { ScoringEngine } from '@football/scoring';
import { Logger } from '../../utils/logger';

export interface FinalValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FinalComboValidator {
  /**
   * Final gatekeeper verification before publication
   */
  public static validate(combo: DailyCombo): FinalValidationResult {
    const errors: string[] = [];

    // 1. If NO_COMBO, verify that selections are empty and reason is provided
    if (combo.status === 'NO_COMBO') {
      if (combo.selections.length !== 0) {
        errors.push('NO_COMBO status cannot have active selections');
      }
      if (!combo.no_combo_reason) {
        errors.push('NO_COMBO status must specify a reason');
      }
      return { isValid: errors.length === 0, errors };
    }

    // 2. Quantity check (3 <= count <= 5)
    if (combo.selections.length < 3 || combo.selections.length > 5) {
      errors.push(`Invalid number of selections: ${combo.selections.length}. Must be between 3 and 5.`);
    }

    if (combo.number_of_matches !== combo.selections.length) {
      errors.push(`Mismatch between number_of_matches (${combo.number_of_matches}) and selections count (${combo.selections.length})`);
    }

    // 3. Uniqueness checks
    const matchIds = new Set<string>();
    const competitions = new Set<string>();

    for (const sel of combo.selections) {
      // Unique match check
      if (matchIds.has(sel.match_id)) {
        errors.push(`Duplicate match detected in combo: ${sel.match_id}`);
      }
      matchIds.add(sel.match_id);

      // Unique competition check
      const compKey = sel.competition.toLowerCase().trim();
      if (competitions.has(compKey)) {
        errors.push(`Multiple matches found in the same competition: ${sel.competition}`);
      }
      competitions.add(compKey);

      // Market authorization check
      if (sel.market !== 'OVER_2_5' && sel.market !== 'BTTS_YES') {
        errors.push(`Unauthorized betting market: ${sel.market}`);
      }

      // Minimum odds check
      if (sel.odds < 1.25) {
        errors.push(`Selection odds for ${sel.home_team} vs ${sel.away_team} is below 1.25 (${sel.odds})`);
      }

      // Probability validity
      if (sel.estimated_probability < 0 || sel.estimated_probability > 1) {
        errors.push(`Invalid probability value (${sel.estimated_probability})`);
      }
    }

    // 4. Mathematical Recalculation Check
    const calculatedOdds = ScoringEngine.calculateTotalOdds(combo.selections.map(s => s.odds));
    if (Math.abs((combo.total_odds || 0) - calculatedOdds) > 0.02) {
      errors.push(`Total odds mismatch: stated ${combo.total_odds}, recalculated ${calculatedOdds}`);
    }

    const calculatedProb = ScoringEngine.calculateTheoreticalProbability(combo.selections.map(s => s.estimated_probability));
    if (Math.abs((combo.theoretical_probability || 0) - calculatedProb) > 0.005) {
      errors.push(`Theoretical probability mismatch: stated ${combo.theoretical_probability}, recalculated ${calculatedProb}`);
    }

    if (errors.length > 0) {
      Logger.error('FinalComboValidator', `Final combo validation failed with ${errors.length} errors`, { errors });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

