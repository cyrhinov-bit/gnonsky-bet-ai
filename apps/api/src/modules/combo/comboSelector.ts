import { Candidate, DailyCombo, ComboSelection } from '@football/types';
import { ScoringEngine } from '@football/scoring';
import { Logger } from '../../utils/logger';

export class ComboSelector {
  public static readonly MIN_SELECTIONS = 3;
  public static readonly MAX_SELECTIONS = 5;

  /**
   * Selects the single best Daily Combo strictly respecting all constraints
   */
  public static selectDailyCombo(
    candidates: Candidate[],
    analysisDate: string,
    modelVersion: string,
    promptVersion: string,
    algorithmVersion: string = 'v1.0.0'
  ): DailyCombo {
    const seenCompetitions = new Set<string>();
    const selectedCandidates: Candidate[] = [];

    // Iterate through ranked candidates and pick maximum 1 per competition
    for (const candidate of candidates) {
      if (selectedCandidates.length >= this.MAX_SELECTIONS) {
        break;
      }

      // Check if league is already selected
      if (!seenCompetitions.has(candidate.competition.toLowerCase().trim())) {
        seenCompetitions.add(candidate.competition.toLowerCase().trim());
        selectedCandidates.push(candidate);
      }
    }

    // FUNDAMENTAL RULE: Never force a combo if fewer than 3 valid candidates
    if (selectedCandidates.length < this.MIN_SELECTIONS) {
      Logger.warn('ComboSelector', `Only ${selectedCandidates.length} eligible candidates found. Emitting NO_COMBO.`);
      return {
        analysis_date: analysisDate,
        status: 'NO_COMBO',
        number_of_matches: 0,
        total_odds: null,
        theoretical_probability: null,
        confidence_score: 0,
        risk: 'LOW',
        selections: [],
        model_version: modelVersion,
        prompt_version: promptVersion,
        algorithm_version: algorithmVersion,
        no_combo_reason: `Insufficient number of strong candidates across unique competitions (${selectedCandidates.length} found, minimum ${this.MIN_SELECTIONS} required). Capital protection rule activated.`
      };
    }

    // Format selections
    const selections: ComboSelection[] = selectedCandidates.map((c, index) => ({
      match_id: c.match_id,
      home_team: c.home_team,
      away_team: c.away_team,
      competition: c.competition,
      market: c.recommended_market,
      odds: c.odds,
      estimated_probability: c.estimated_probability,
      confidence_score: c.confidence_score,
      selection_order: index + 1
    }));

    // Recalculate deterministic metrics in backend
    const oddsArray = selections.map(s => s.odds);
    const probArray = selections.map(s => s.estimated_probability);
    
    const totalOdds = ScoringEngine.calculateTotalOdds(oddsArray);
    const theoreticalProbability = ScoringEngine.calculateTheoreticalProbability(probArray);

    // Compute average confidence score
    const avgConfidence = Math.round(
      selections.reduce((sum, s) => sum + s.confidence_score, 0) / selections.length
    );

    // Assess overall combo risk
    const risk = avgConfidence >= 85 ? 'LOW' : avgConfidence >= 70 ? 'MODERATE' : 'HIGH';

    Logger.info('ComboSelector', `Successfully generated Daily Combo with ${selections.length} matches. Total Odds: ${totalOdds}, Conf: ${avgConfidence}`);

    return {
      analysis_date: analysisDate,
      status: 'PUBLISHED',
      number_of_matches: selections.length,
      total_odds: totalOdds,
      theoretical_probability: theoreticalProbability,
      confidence_score: avgConfidence,
      risk,
      selections,
      model_version: modelVersion,
      prompt_version: promptVersion,
      algorithm_version: algorithmVersion,
      no_combo_reason: null
    };
  }
}

