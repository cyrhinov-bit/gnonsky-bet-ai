import { RawBetStudyMatch } from './collector';
import { NormalizedMatch } from '@football/types';

export class BetStudyNormalizer {
  /**
   * Transforms raw scraped BetStudy data into standard NormalizedMatch format
   */
  public static normalize(raw: RawBetStudyMatch, assignedMatchId?: string): NormalizedMatch {
    const matchId = assignedMatchId || raw.externalId;

    return {
      match_id: matchId,
      external_id: raw.externalId,
      home_team: raw.homeTeam.trim(),
      away_team: raw.awayTeam.trim(),
      competition: raw.competition.trim(),
      country: raw.country.trim(),
      match_date: raw.matchDate,
      odds: {
        over_2_5: raw.odds.over25 !== null && raw.odds.over25 > 0 ? Number(raw.odds.over25.toFixed(2)) : null,
        btts_yes: raw.odds.bttsYes !== null && raw.odds.bttsYes > 0 ? Number(raw.odds.bttsYes.toFixed(2)) : null
      },
      statistics: {
        match_id: matchId,
        goals_average: raw.statistics.goalsAvg,
        home_goals_average: raw.statistics.homeGoalsAvg,
        away_goals_average: raw.statistics.awayGoalsAvg,
        over_1_5: raw.statistics.over15Freq,
        over_2_5: raw.statistics.over25Freq,
        over_3_5: raw.statistics.over35Freq,
        btts: raw.statistics.bttsFreq,
        home_over_2_5: raw.statistics.homeOver25,
        away_over_2_5: raw.statistics.awayOver25,
        home_btts: raw.statistics.homeBtts,
        away_btts: raw.statistics.awayBtts,
        home_scored_average: raw.statistics.homeScoredAvg,
        away_scored_average: raw.statistics.awayScoredAvg,
        home_conceded_average: raw.statistics.homeConcededAvg,
        away_conceded_average: raw.statistics.awayConcededAvg,
        recent_form: raw.statistics.recentForm || [],
        home_form: raw.statistics.homeForm || [],
        away_form: raw.statistics.awayForm || [],
        h2h_data: raw.statistics.h2h || [],
        computer_prediction: raw.statistics.computerPrediction || null,
        data_quality: this.calculateDataQuality(raw),
        data_quantity: this.calculateDataQuantity(raw),
        raw_data: raw.rawPayload
      }
    };
  }

  private static calculateDataQuality(raw: RawBetStudyMatch): number {
    let score = 100;
    if (raw.odds.over25 === null) score -= 15;
    if (raw.odds.bttsYes === null) score -= 15;
    if (raw.statistics.goalsAvg === null) score -= 20;
    if (!raw.statistics.recentForm || raw.statistics.recentForm.length === 0) score -= 20;
    if (!raw.statistics.h2h || raw.statistics.h2h.length === 0) score -= 10;
    return Math.max(0, score);
  }

  private static calculateDataQuantity(raw: RawBetStudyMatch): number {
    let count = 0;
    const totalFields = 12;
    if (raw.statistics.goalsAvg !== null) count++;
    if (raw.statistics.homeGoalsAvg !== null) count++;
    if (raw.statistics.awayGoalsAvg !== null) count++;
    if (raw.statistics.over25Freq !== null) count++;
    if (raw.statistics.bttsFreq !== null) count++;
    if (raw.statistics.homeOver25 !== null) count++;
    if (raw.statistics.awayOver25 !== null) count++;
    if (raw.statistics.homeBtts !== null) count++;
    if (raw.statistics.awayBtts !== null) count++;
    if (raw.statistics.recentForm && raw.statistics.recentForm.length >= 3) count++;
    if (raw.statistics.h2h && raw.statistics.h2h.length >= 1) count++;
    if (raw.statistics.computerPrediction) count++;

    return Math.round((count / totalFields) * 100);
  }
}

