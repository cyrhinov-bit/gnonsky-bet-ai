import { NormalizedMatch } from '@football/types';
import { MatchStatisticsSchema } from '@football/validation';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DataValidator {
  /**
   * Validates integrity and consistency of normalized match before pre-filtering & AI
   */
  public static validate(match: NormalizedMatch, seenExternalIds: Set<string> = new Set()): ValidationResult {
    const errors: string[] = [];

    // 1. Basic Identifiers & Metadata
    if (!match.match_id || match.match_id.trim().length === 0) {
      errors.push('Missing match_id');
    }
    if (!match.external_id || match.external_id.trim().length === 0) {
      errors.push('Missing external_id');
    } else if (seenExternalIds.has(match.external_id)) {
      errors.push(`Duplicate external_id detected: ${match.external_id}`);
    }

    if (!match.home_team || match.home_team.trim().length === 0) {
      errors.push('Missing home_team');
    }
    if (!match.away_team || match.away_team.trim().length === 0) {
      errors.push('Missing away_team');
    }
    if (!match.competition || match.competition.trim().length === 0) {
      errors.push('Missing competition');
    }

    // 2. Date verification
    const matchTime = new Date(match.match_date).getTime();
    if (isNaN(matchTime)) {
      errors.push('Invalid match_date format');
    }

    // 3. Odds presence check
    if (match.odds.over_2_5 === null && match.odds.btts_yes === null) {
      errors.push('No target odds available for either Over 2.5 or BTTS Yes');
    }

    // 4. Statistics Zod schema validation
    const statParse = MatchStatisticsSchema.safeParse(match.statistics);
    if (!statParse.success) {
      errors.push(`Statistics schema mismatch: ${statParse.error.message}`);
    }

    // 5. Numerical Coherence
    const stats = match.statistics;
    if (stats.over_2_5 !== null && (stats.over_2_5 < 0 || stats.over_2_5 > 1)) {
      errors.push('Over 2.5 frequency out of [0, 1] range');
    }
    if (stats.btts !== null && (stats.btts < 0 || stats.btts > 1)) {
      errors.push('BTTS frequency out of [0, 1] range');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

