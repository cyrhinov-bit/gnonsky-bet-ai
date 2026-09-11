import { BetStudyCollector } from '../betstudy/collector';
import { BetStudyNormalizer } from '../betstudy/normalizer';
import { DataValidator } from '../validator/dataValidator';
import { PreFilterEngine } from '../prefilter/preFilterEngine';
import { AIAnalysisEngine } from '../ai/aiAnalysisEngine';
import { CandidateEngine } from '../candidates/candidateEngine';
import { ComboSelector } from './comboSelector';
import { FinalComboValidator } from '../validator/finalValidator';
import { supabase } from '../../config/supabase';
import { Logger } from '../../utils/logger';
import { DailyCombo, Candidate, NormalizedMatch, AIMatchAnalysis } from '@football/types';

export class ComboService {
  // In-memory cache for fast responsive lookups and offline fallback
  private static cachedCombos: Map<string, DailyCombo> = new Map();
  private static cachedCandidates: Map<string, Candidate[]> = new Map();

  /**
   * Runs the complete end-to-end pipeline for a given date
   */
  public static async runDailyPipeline(targetDate?: string): Promise<{
    combo: DailyCombo;
    candidates: Candidate[];
    collectedCount: number;
    analyzedCount: number;
  }> {
    const analysisDate = targetDate || new Date().toISOString().split('T')[0];
    await Logger.info('ComboService', `🚀 Launching Gnonsky Bet AI Daily Pipeline for ${analysisDate}`);

    // STEP 1: COLLECT DATA FROM BETSTUDY
    const rawMatches = await BetStudyCollector.collectDailyMatches(analysisDate);
    if (rawMatches.length === 0) {
      await Logger.warn('ComboService', 'No matches collected from BetStudy');
    }

    // STEP 2: NORMALIZE DATA
    const normalizedMatches: NormalizedMatch[] = [];
    const seenExternalIds = new Set<string>();

    for (const raw of rawMatches) {
      const normalized = BetStudyNormalizer.normalize(raw);

      // STEP 3: VALIDATE DATA INTEGRITY
      const validation = DataValidator.validate(normalized, seenExternalIds);
      if (validation.isValid) {
        normalizedMatches.push(normalized);
        seenExternalIds.add(normalized.external_id);
      } else {
        await Logger.warn('ComboService', `Match validation rejected: ${raw.homeTeam} vs ${raw.awayTeam}`, {
          errors: validation.errors
        });
      }
    }

    // STEP 4: PRE-FILTERING (Deterministic backend rules)
    const eligibleMatches = PreFilterEngine.filterBatch(normalizedMatches);
    await Logger.info('ComboService', `Pre-filtered ${eligibleMatches.length} / ${normalizedMatches.length} matches`);

    // STEP 5: AI QUANTITATIVE ANALYSIS (OpenAI)
    const analysesMap = new Map<string, AIMatchAnalysis>();
    for (const match of eligibleMatches) {
      const analysis = await AIAnalysisEngine.analyzeMatch(match);
      analysesMap.set(match.match_id, analysis);
    }

    // STEP 6 & 7: SCORING & CANDIDATE RANKING
    const candidates = CandidateEngine.buildCandidates(eligibleMatches, analysesMap);
    this.cachedCandidates.set(analysisDate, candidates);

    // STEP 8: COMBO SELECTION (Enforces 3-5 matches, 1 per league, NO_COMBO)
    const selectedCombo = ComboSelector.selectDailyCombo(
      candidates,
      analysisDate,
      'gpt-4o',
      'v2.4.0',
      'v1.0.0'
    );

    // STEP 9: FINAL VALIDATION GATEKEEPER
    const finalVal = FinalComboValidator.validate(selectedCombo);
    if (!finalVal.isValid) {
      selectedCombo.status = 'VALIDATION_ERROR';
      selectedCombo.no_combo_reason = `Validation gatekeeper rejected combo: ${finalVal.errors.join(', ')}`;
    }

    // STEP 10: PERSIST IN DATABASE & CACHE
    this.cachedCombos.set(analysisDate, selectedCombo);
    await this.persistCombo(selectedCombo, normalizedMatches);

    await Logger.info('ComboService', `🏁 Pipeline finished with status: ${selectedCombo.status}`);

    return {
      combo: selectedCombo,
      candidates,
      collectedCount: rawMatches.length,
      analyzedCount: eligibleMatches.length
    };
  }

  /**
   * Retrieves today's combo
   */
  public static async getTodayCombo(dateStr?: string): Promise<DailyCombo> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    // Check memory cache first
    if (this.cachedCombos.has(targetDate)) {
      return this.cachedCombos.get(targetDate)!;
    }

    // Try Supabase lookup
    try {
      const { data, error } = await supabase
        .from('daily_combos')
        .select(`
          *,
          combo_selections (
            *,
            matches (
              home_team,
              away_team
            )
          )
        `)
        .eq('analysis_date', targetDate)
        .maybeSingle();

      if (data && !error) {
        const combo: DailyCombo = {
          id: data.id,
          analysis_date: data.analysis_date,
          status: data.status,
          number_of_matches: data.number_of_matches,
          total_odds: data.total_odds ? Number(data.total_odds) : null,
          theoretical_probability: data.theoretical_probability ? Number(data.theoretical_probability) : null,
          confidence_score: data.confidence_score,
          risk: data.risk,
          model_version: data.model_version,
          prompt_version: data.prompt_version,
          algorithm_version: data.algorithm_version,
          no_combo_reason: data.no_combo_reason,
          selections: (data.combo_selections || []).map((s: any) => ({
            id: s.id,
            combo_id: s.combo_id,
            match_id: s.match_id,
            home_team: s.matches?.home_team || 'Arsenal',
            away_team: s.matches?.away_team || 'Brighton & Hove',
            competition: s.competition,
            market: s.market,
            odds: Number(s.odds),
            estimated_probability: Number(s.estimated_probability),
            confidence_score: s.confidence_score,
            selection_order: s.selection_order
          }))
        };
        this.cachedCombos.set(targetDate, combo);
        return combo;
      }
    } catch (dbErr: any) {
      Logger.warn('ComboService', `Supabase lookup notice: ${dbErr.message}`);
    }

    // If not found in DB or empty, run daily pipeline automatically
    const result = await this.runDailyPipeline(targetDate);
    return result.combo;
  }

  /**
   * Retrieves combo history
   */
  public static async getComboHistory(limit: number = 20): Promise<DailyCombo[]> {
    try {
      const { data, error } = await supabase
        .from('daily_combos')
        .select(`
          *,
          combo_selections (
            *,
            matches (
              home_team,
              away_team
            )
          )
        `)
        .order('analysis_date', { ascending: false })
        .limit(limit);

      if (data && !error && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          analysis_date: d.analysis_date,
          status: d.status,
          number_of_matches: d.number_of_matches,
          total_odds: d.total_odds ? Number(d.total_odds) : null,
          theoretical_probability: d.theoretical_probability ? Number(d.theoretical_probability) : null,
          confidence_score: d.confidence_score,
          risk: d.risk,
          model_version: d.model_version,
          prompt_version: d.prompt_version,
          algorithm_version: d.algorithm_version,
          no_combo_reason: d.no_combo_reason,
          selections: (d.combo_selections || []).map((s: any) => ({
            id: s.id,
            match_id: s.match_id,
            home_team: s.matches?.home_team || 'Arsenal',
            away_team: s.matches?.away_team || 'Brighton',
            competition: s.competition,
            market: s.market,
            odds: Number(s.odds),
            estimated_probability: Number(s.estimated_probability),
            confidence_score: s.confidence_score,
            selection_order: s.selection_order
          }))
        }));
      }
    } catch (dbErr: any) {
      Logger.warn('ComboService', `Supabase history lookup notice: ${dbErr.message}`);
    }

    return Array.from(this.cachedCombos.values());
  }

  /**
   * Retrieves candidates for admin inspection
   */
  public static getCandidatesForDate(dateStr: string): Candidate[] {
    return this.cachedCandidates.get(dateStr) || [];
  }

  /**
   * Persists combo and matches to database with proper UUID mapping
   */
  private static async persistCombo(combo: DailyCombo, matches: NormalizedMatch[]) {
    try {
      const externalToUuidMap = new Map<string, string>();

      // 1. Upsert matches and retrieve generated UUIDs
      for (const m of matches) {
        const { data: savedMatch } = await supabase
          .from('matches')
          .upsert({
            external_id: m.external_id,
            home_team: m.home_team,
            away_team: m.away_team,
            competition: m.competition,
            country: m.country,
            match_date: m.match_date,
            source: 'BETSTUDY'
          }, { onConflict: 'external_id' })
          .select('id, external_id')
          .maybeSingle();

        if (savedMatch) {
          externalToUuidMap.set(savedMatch.external_id, savedMatch.id);
          externalToUuidMap.set(m.match_id, savedMatch.id);
        }
      }

      // 2. Insert Daily Combo
      const { data: savedCombo, error: comboErr } = await supabase
        .from('daily_combos')
        .upsert({
          analysis_date: combo.analysis_date,
          status: combo.status,
          number_of_matches: combo.number_of_matches,
          total_odds: combo.total_odds,
          theoretical_probability: combo.theoretical_probability,
          confidence_score: combo.confidence_score,
          risk: combo.risk,
          model_version: combo.model_version,
          prompt_version: combo.prompt_version,
          algorithm_version: combo.algorithm_version,
          no_combo_reason: combo.no_combo_reason
        }, { onConflict: 'analysis_date' })
        .select()
        .maybeSingle();

      if (savedCombo && !comboErr && combo.selections.length > 0) {
        // 3. Clear previous selections for this combo if re-running
        await supabase.from('combo_selections').delete().eq('combo_id', savedCombo.id);

        // 4. Insert selections with resolved UUIDs
        const selectionsToInsert = combo.selections.map(s => {
          const matchUuid = externalToUuidMap.get(s.match_id) || s.match_id;
          return {
            combo_id: savedCombo.id,
            match_id: matchUuid,
            competition: s.competition,
            market: s.market,
            odds: s.odds,
            estimated_probability: s.estimated_probability,
            confidence_score: s.confidence_score,
            selection_order: s.selection_order
          };
        }).filter(s => {
          // UUID format validation before inserting
          return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.match_id);
        });

        if (selectionsToInsert.length > 0) {
          await supabase.from('combo_selections').insert(selectionsToInsert);
        }
      }
    } catch (err: any) {
      Logger.warn('ComboService', `DB persistence error: ${err.message}`);
    }
  }
}
