import { supabase } from '../../config/supabase';
import { Logger } from '../../utils/logger';

export interface MatchScoreResult {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export class ResultVerifier {
  /**
   * Evaluates if a betting market won based on final match score
   */
  public static evaluateMarket(market: 'OVER_2_5' | 'BTTS_YES', homeScore: number, awayScore: number): boolean {
    const totalGoals = homeScore + awayScore;
    if (market === 'OVER_2_5') {
      return totalGoals >= 3;
    }
    if (market === 'BTTS_YES') {
      return homeScore > 0 && awayScore > 0;
    }
    return false;
  }

  /**
   * Verifies pending selections and updates prediction results in DB
   */
  public static async verifyPendingResults(scores: MatchScoreResult[]): Promise<{ verifiedCount: number; wonCount: number }> {
    let verifiedCount = 0;
    let wonCount = 0;

    for (const score of scores) {
      try {
        const { data: selections } = await supabase
          .from('combo_selections')
          .select('id, market')
          .eq('match_id', score.matchId);

        if (selections && selections.length > 0) {
          for (const sel of selections) {
            const isWon = this.evaluateMarket(sel.market as any, score.homeScore, score.awayScore);
            if (isWon) wonCount++;
            verifiedCount++;

            await supabase.from('prediction_results').upsert({
              selection_id: sel.id,
              actual_score: `${score.homeScore}-${score.awayScore}`,
              actual_result: {
                total_goals: score.homeScore + score.awayScore,
                btts: score.homeScore > 0 && score.awayScore > 0,
                over_2_5: score.homeScore + score.awayScore >= 3
              },
              won: isWon,
              verified_at: new Date().toISOString()
            });
          }
        }
      } catch (err: any) {
        Logger.error('ResultVerifier', `Failed to verify match ${score.matchId}: ${err.message}`);
      }
    }

    Logger.info('ResultVerifier', `Verified ${verifiedCount} selections. Won: ${wonCount}`);
    return { verifiedCount, wonCount };
  }
}

