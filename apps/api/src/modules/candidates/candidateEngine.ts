import { NormalizedMatch, AIMatchAnalysis, Candidate } from '@football/types';
import { ScoringEngine } from '@football/scoring';
import { Logger } from '../../utils/logger';

export class CandidateEngine {
  /**
   * Evaluates and builds ranked candidates from normalized matches and their AI analyses
   */
  public static buildCandidates(
    matches: NormalizedMatch[],
    analyses: Map<string, AIMatchAnalysis>
  ): Candidate[] {
    const candidates: Candidate[] = [];

    for (const match of matches) {
      const aiAnalysis = analyses.get(match.match_id);
      if (!aiAnalysis) {
        Logger.warn('CandidateEngine', `No AI analysis found for match ${match.match_id}`);
        continue;
      }

      // Check inclusion flag from AI and pre-filtering
      if (!aiAnalysis.include_candidate) {
        Logger.debug('CandidateEngine', `Match ${match.home_team} vs ${match.away_team} excluded: ${aiAnalysis.exclusion_reason}`);
        continue;
      }

      const market = aiAnalysis.recommended_market;
      const odds = market === 'OVER_2_5' ? match.odds.over_2_5 : match.odds.btts_yes;

      // Strict minimum odds check
      if (!odds || odds < 1.25) {
        Logger.debug('CandidateEngine', `Match ${match.home_team} vs ${match.away_team} excluded: odds for ${market} (${odds}) below 1.25`);
        continue;
      }

      const estimatedProb = market === 'OVER_2_5' ? aiAnalysis.over_2_5_probability : aiAnalysis.btts_probability;

      // Deterministic scoring calculation
      const scoringBreakdown = ScoringEngine.calculateCandidateScore(match, aiAnalysis);

      candidates.push({
        match_id: match.match_id,
        external_id: match.external_id,
        home_team: match.home_team,
        away_team: match.away_team,
        competition: match.competition,
        country: match.country,
        match_date: match.match_date,
        recommended_market: market,
        odds: Number(odds.toFixed(2)),
        estimated_probability: Number(estimatedProb.toFixed(2)),
        confidence_score: scoringBreakdown.total_score,
        risk: aiAnalysis.risk,
        statistical_convergence: aiAnalysis.statistical_convergence,
        scoring_breakdown: scoringBreakdown
      });
    }

    // Rank candidates: Probability DESC -> Confidence DESC -> Low Risk -> Odds
    candidates.sort((a, b) => {
      // 1. Estimated Probability DESC
      if (b.estimated_probability !== a.estimated_probability) {
        return b.estimated_probability - a.estimated_probability;
      }
      // 2. Confidence Score DESC
      if (b.confidence_score !== a.confidence_score) {
        return b.confidence_score - a.confidence_score;
      }
      // 3. Convergence DESC
      if (b.statistical_convergence !== a.statistical_convergence) {
        return b.statistical_convergence - a.statistical_convergence;
      }
      // 4. Odds DESC (if equal probability/confidence, prefer value)
      return b.odds - a.odds;
    });

    Logger.info('CandidateEngine', `Generated ${candidates.length} qualified candidates`);
    return candidates;
  }
}

