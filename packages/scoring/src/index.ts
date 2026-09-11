import { MatchStatistics, BettingMarket, Candidate, AIMatchAnalysis, NormalizedMatch } from '@football/types';

export interface ScoringWeights {
  goalsWeight: number;        // 25%
  marketWeight: number;       // 20%
  formWeight: number;         // 15%
  homeAwayWeight: number;     // 10%
  goalsAvgWeight: number;     // 10%
  convergenceWeight: number;  // 10%
  h2hWeight: number;          // 5%
  dataQualityWeight: number;  // 5%
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  goalsWeight: 0.25,
  marketWeight: 0.20,
  formWeight: 0.15,
  homeAwayWeight: 0.10,
  goalsAvgWeight: 0.10,
  convergenceWeight: 0.10,
  h2hWeight: 0.05,
  dataQualityWeight: 0.05
};

export class ScoringEngine {
  /**
   * Calculates deterministic candidate score from normalized statistics, odds and AI evaluation
   */
  public static calculateCandidateScore(
    match: NormalizedMatch,
    aiAnalysis: AIMatchAnalysis,
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ): Candidate['scoring_breakdown'] {
    const stats = match.statistics;
    const market = aiAnalysis.recommended_market;

    // 1. Goal Statistics Score (0 - 100) -> 25%
    let goalsScore = 50;
    if (stats.over_2_5 != null && stats.btts != null) {
      goalsScore = ((stats.over_2_5 + stats.btts) / 2) * 100;
    }

    // 2. Specific Target Market Frequency Score (0 - 100) -> 20%
    let marketScore = 50;
    if (market === 'OVER_2_5') {
      const o25 = stats.over_2_5 ?? 0.5;
      const homeO25 = stats.home_over_2_5 ?? o25;
      const awayO25 = stats.away_over_2_5 ?? o25;
      marketScore = ((o25 * 0.4) + (homeO25 * 0.3) + (awayO25 * 0.3)) * 100;
    } else {
      const btts = stats.btts ?? 0.5;
      const homeBtts = stats.home_btts ?? btts;
      const awayBtts = stats.away_btts ?? btts;
      marketScore = ((btts * 0.4) + (homeBtts * 0.3) + (awayBtts * 0.3)) * 100;
    }

    // 3. Recent Form Score (0 - 100) -> 15%
    let formScore = 70; // Baseline
    if (stats.recent_form && stats.recent_form.length > 0) {
      const winCount = stats.recent_form.filter(f => f.toUpperCase() === 'W').length;
      formScore = Math.min(100, (winCount / stats.recent_form.length) * 100 + 20);
    }

    // 4. Home / Away Goals Scored & Conceded (0 - 100) -> 10%
    let homeAwayScore = 60;
    if (typeof stats.home_scored_average === 'number' && typeof stats.away_scored_average === 'number') {
      const attackingProwess = (stats.home_scored_average + stats.away_scored_average) / 2;
      homeAwayScore = Math.min(100, (attackingProwess / 2.5) * 80);
    }

    // 5. Goals Average Score (0 - 100) -> 10%
    let goalsAvgScore = 50;
    if (typeof stats.goals_average === 'number') {
      // Scale: 2.5 goals = 70pts, 3.0 goals = 85pts, 3.5+ goals = 100pts
      goalsAvgScore = Math.min(100, Math.max(0, (stats.goals_average / 3.2) * 85));
    }

    // 6. Convergence Score (0 - 100) -> 10%
    let convergenceScore = (aiAnalysis.statistical_convergence ?? 0.7) * 100;
    if (stats.computer_prediction) {
      const cpProb = market === 'OVER_2_5' 
        ? (stats.computer_prediction.over_2_5_prob ?? 0.6)
        : (stats.computer_prediction.btts_prob ?? 0.6);
      const diff = Math.abs(cpProb - (market === 'OVER_2_5' ? aiAnalysis.over_2_5_probability : aiAnalysis.btts_probability));
      convergenceScore = Math.max(0, 100 - (diff * 100));
    }

    // 7. H2H Score (0 - 100) -> 5%
    let h2hScore = 70;
    if (stats.h2h_data && stats.h2h_data.length > 0) {
      const matchCount = stats.h2h_data.length;
      let matchingCriteriaCount = 0;
      stats.h2h_data.forEach(h => {
        if (market === 'OVER_2_5' && (h.home_score + h.away_score >= 3)) matchingCriteriaCount++;
        if (market === 'BTTS_YES' && (h.home_score > 0 && h.away_score > 0)) matchingCriteriaCount++;
      });
      h2hScore = (matchingCriteriaCount / matchCount) * 100;
    }

    // 8. Data Quality Score (0 - 100) -> 5%
    const dataQualityScore = ((stats.data_quality ?? 100) * 0.5) + ((stats.data_quantity ?? 100) * 0.5);

    // Weighted Base Calculation
    const baseScore =
      goalsScore * weights.goalsWeight +
      marketScore * weights.marketWeight +
      formScore * weights.formWeight +
      homeAwayScore * weights.homeAwayWeight +
      goalsAvgScore * weights.goalsAvgWeight +
      convergenceScore * weights.convergenceWeight +
      h2hScore * weights.h2hWeight +
      dataQualityScore * weights.dataQualityWeight;

    // Apply Penalties (Contradictions, Anomalies, Irregularities)
    let penalties = 0;
    if (aiAnalysis.contradictions && aiAnalysis.contradictions.length > 0) {
      penalties += aiAnalysis.contradictions.length * 10;
    }
    if (aiAnalysis.anomalies && aiAnalysis.anomalies.length > 0) {
      penalties += aiAnalysis.anomalies.length * 8;
    }
    if (stats.data_quantity < 50) {
      penalties += 15;
    }

    const totalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalties)));

    return {
      goals_score: Math.round(goalsScore),
      market_score: Math.round(marketScore),
      form_score: Math.round(formScore),
      home_away_score: Math.round(homeAwayScore),
      goals_avg_score: Math.round(goalsAvgScore),
      convergence_score: Math.round(convergenceScore),
      h2h_score: Math.round(h2hScore),
      data_quality_score: Math.round(dataQualityScore),
      penalties,
      total_score: totalScore
    };
  }

  /**
   * Recalculates total combined deterministic odds: Product of each selection odds
   */
  public static calculateTotalOdds(oddsList: number[]): number {
    if (oddsList.length === 0) return 0;
    const rawTotal = oddsList.reduce((acc, curr) => acc * curr, 1);
    return Math.round(rawTotal * 100) / 100;
  }

  /**
   * Recalculates theoretical combined probability: Product of individual probabilities
   */
  public static calculateTheoreticalProbability(probabilities: number[]): number {
    if (probabilities.length === 0) return 0;
    const rawTotal = probabilities.reduce((acc, curr) => acc * curr, 1);
    return Math.round(rawTotal * 10000) / 10000;
  }
}

