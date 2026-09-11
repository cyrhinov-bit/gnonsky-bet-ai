import { z } from 'zod';

export const BettingMarketSchema = z.enum(['OVER_2_5', 'BTTS_YES']);

export const RiskLevelSchema = z.enum(['LOW', 'MODERATE', 'HIGH']);

export const MatchStatusSchema = z.enum(['SCHEDULED', 'IN_PLAY', 'FINISHED', 'POSTPONED', 'CANCELLED']);

export const ComboStatusSchema = z.enum(['PUBLISHED', 'NO_COMBO', 'VALIDATION_ERROR']);

// Match Schema
export const MatchSchema = z.object({
  id: z.string().uuid().optional(),
  external_id: z.string().min(1, 'External ID is required'),
  home_team: z.string().min(1, 'Home team is required'),
  away_team: z.string().min(1, 'Away team is required'),
  competition: z.string().min(1, 'Competition is required'),
  country: z.string().min(1, 'Country is required'),
  match_date: z.string().datetime(),
  status: MatchStatusSchema.default('SCHEDULED'),
  source: z.literal('BETSTUDY').default('BETSTUDY')
});

// Match Statistics Schema
export const MatchStatisticsSchema = z.object({
  match_id: z.string(),
  goals_average: z.number().nullable(),
  home_goals_average: z.number().nullable(),
  away_goals_average: z.number().nullable(),
  over_1_5: z.number().min(0).max(1).nullable(),
  over_2_5: z.number().min(0).max(1).nullable(),
  over_3_5: z.number().min(0).max(1).nullable(),
  btts: z.number().min(0).max(1).nullable(),
  home_over_2_5: z.number().min(0).max(1).nullable(),
  away_over_2_5: z.number().min(0).max(1).nullable(),
  home_btts: z.number().min(0).max(1).nullable(),
  away_btts: z.number().min(0).max(1).nullable(),
  home_scored_average: z.number().nullable(),
  away_scored_average: z.number().nullable(),
  home_conceded_average: z.number().nullable(),
  away_conceded_average: z.number().nullable(),
  recent_form: z.array(z.string()).default([]),
  home_form: z.array(z.string()).default([]),
  away_form: z.array(z.string()).default([]),
  h2h_data: z.array(z.object({
    date: z.string(),
    home_score: z.number(),
    away_score: z.number(),
    competition: z.string().optional()
  })).default([]),
  computer_prediction: z.object({
    predicted_score: z.string().optional(),
    over_2_5_prob: z.number().optional(),
    btts_prob: z.number().optional(),
    recommendation: z.string().optional()
  }).nullable().optional(),
  data_quality: z.number().min(0).max(100).default(100),
  data_quantity: z.number().min(0).max(100).default(100)
});

// Match Odds Schema
export const MatchOddsSchema = z.object({
  match_id: z.string(),
  over_2_5_odds: z.number().positive().nullable(),
  btts_yes_odds: z.number().positive().nullable(),
  source: z.literal('BETSTUDY').default('BETSTUDY'),
  captured_at: z.string().datetime().optional()
});

// AI Analysis Output Schema (Strict JSON validation from OpenAI)
export const AIMatchAnalysisOutputSchema = z.object({
  match_id: z.string().min(1),
  over_2_5_probability: z.number().min(0).max(1),
  btts_probability: z.number().min(0).max(1),
  recommended_market: BettingMarketSchema,
  confidence_score: z.number().int().min(0).max(100),
  risk: RiskLevelSchema,
  statistical_convergence: z.number().min(0).max(1),
  contradictions: z.array(z.string()).default([]),
  anomalies: z.array(z.string()).default([]),
  include_candidate: z.boolean(),
  exclusion_reason: z.string().nullable().optional()
});

// Combo Selection Schema
export const ComboSelectionSchema = z.object({
  match_id: z.string(),
  home_team: z.string(),
  away_team: z.string(),
  competition: z.string(),
  market: BettingMarketSchema,
  odds: z.number().min(1.25, 'Odds must be at least 1.25'),
  estimated_probability: z.number().min(0).max(1),
  confidence_score: z.number().int().min(0).max(100),
  selection_order: z.number().int().positive()
});

// Final Combo Schema
export const DailyComboSchema = z.object({
  analysis_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  status: ComboStatusSchema,
  number_of_matches: z.number().int().min(0).max(5),
  total_odds: z.number().nullable(),
  theoretical_probability: z.number().nullable(),
  confidence_score: z.number().int().min(0).max(100),
  risk: RiskLevelSchema,
  selections: z.array(ComboSelectionSchema).refine((selections) => {
    // If not NO_COMBO, selections must be between 3 and 5
    if (selections.length > 0) {
      return selections.length >= 3 && selections.length <= 5;
    }
    return true;
  }, { message: 'A valid combo must contain between 3 and 5 selections' }),
  model_version: z.string(),
  prompt_version: z.string(),
  algorithm_version: z.string(),
  no_combo_reason: z.string().nullable().optional()
});

