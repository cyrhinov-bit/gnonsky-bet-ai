import { NormalizedMatch } from '@football/types';
import { Logger } from '../../utils/logger';

export interface PreFilterResult {
  passed: boolean;
  eligibleMarkets: ('OVER_2_5' | 'BTTS_YES')[];
  reason?: string;
}

export class PreFilterEngine {
  public static readonly MIN_ODDS = 1.25;

  /**
   * Fast deterministic filter executed before calling OpenAI
   */
  public static filterMatch(match: NormalizedMatch): PreFilterResult {
    const now = Date.now();
    const matchTime = new Date(match.match_date).getTime();

    // 1. Exclude already started or finished matches
    if (matchTime <= now) {
      return {
        passed: false,
        eligibleMarkets: [],
        reason: 'Match already in play or finished'
      };
    }

    // 2. Check odds threshold (>= 1.25)
    const eligibleMarkets: ('OVER_2_5' | 'BTTS_YES')[] = [];

    if (match.odds.over_2_5 !== null && match.odds.over_2_5 >= this.MIN_ODDS) {
      eligibleMarkets.push('OVER_2_5');
    }

    if (match.odds.btts_yes !== null && match.odds.btts_yes >= this.MIN_ODDS) {
      eligibleMarkets.push('BTTS_YES');
    }

    if (eligibleMarkets.length === 0) {
      return {
        passed: false,
        eligibleMarkets: [],
        reason: `Odds for both markets are either missing or below minimum threshold (${this.MIN_ODDS})`
      };
    }

    // 3. Minimum statistical history requirement
    const stats = match.statistics;
    if (stats.data_quantity < 40) {
      return {
        passed: false,
        eligibleMarkets: [],
        reason: 'Insufficient statistical history (< 40% data quantity)'
      };
    }

    // 4. Must have at least basic goal averages or market frequencies
    if (stats.goals_average === null && stats.over_2_5 === null && stats.btts === null) {
      return {
        passed: false,
        eligibleMarkets: [],
        reason: 'Missing fundamental goal metrics'
      };
    }

    return {
      passed: true,
      eligibleMarkets
    };
  }

  /**
   * Filters an array of matches and returns only viable candidates
   */
  public static filterBatch(matches: NormalizedMatch[]): NormalizedMatch[] {
    const accepted: NormalizedMatch[] = [];

    for (const match of matches) {
      const result = this.filterMatch(match);
      if (result.passed) {
        accepted.push(match);
      } else {
        Logger.debug('PreFilterEngine', `Filtered out match ${match.home_team} vs ${match.away_team}: ${result.reason}`);
      }
    }

    return accepted;
  }
}

