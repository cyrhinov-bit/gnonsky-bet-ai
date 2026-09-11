export type MatchStatus = 'SCHEDULED' | 'IN_PLAY' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';

export type BettingMarket = 'OVER_2_5' | 'BTTS_YES';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export type ComboStatus = 'PUBLISHED' | 'NO_COMBO' | 'VALIDATION_ERROR';

export interface Match {
  id: string;
  external_id: string;
  home_team: string;
  away_team: string;
  competition: string;
  country: string;
  match_date: string;
  status: MatchStatus;
  source: 'BETSTUDY';
  created_at: string;
  updated_at: string;
}

export interface MatchStatistics {
  id?: string;
  match_id: string;
  goals_average: number | null;
  home_goals_average: number | null;
  away_goals_average: number | null;
  over_1_5: number | null;
  over_2_5: number | null;
  over_3_5: number | null;
  btts: number | null;
  home_over_2_5: number | null;
  away_over_2_5: number | null;
  home_btts: number | null;
  away_btts: number | null;
  home_scored_average: number | null;
  away_scored_average: number | null;
  home_conceded_average: number | null;
  away_conceded_average: number | null;
  recent_form: string[];
  home_form: string[];
  away_form: string[];
  h2h_data: Array<{
    date: string;
    home_score: number;
    away_score: number;
    competition?: string;
  }>;
  computer_prediction?: {
    predicted_score?: string;
    over_2_5_prob?: number;
    btts_prob?: number;
    recommendation?: string;
  } | null;
  data_quality: number;
  data_quantity: number;
  raw_data?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface MatchOdds {
  id?: string;
  match_id: string;
  over_2_5_odds: number | null;
  btts_yes_odds: number | null;
  source: 'BETSTUDY';
  captured_at: string;
}

export interface NormalizedMatch {
  match_id: string;
  external_id: string;
  home_team: string;
  away_team: string;
  competition: string;
  country: string;
  match_date: string;
  statistics: MatchStatistics;
  odds: {
    over_2_5: number | null;
    btts_yes: number | null;
  };
}

export interface AIMatchAnalysis {
  match_id: string;
  over_2_5_probability: number;
  btts_probability: number;
  recommended_market: BettingMarket;
  confidence_score: number;
  risk: RiskLevel;
  statistical_convergence: number;
  contradictions: string[];
  anomalies: string[];
  include_candidate: boolean;
  exclusion_reason?: string | null;
  model_name: string;
  model_version: string;
  prompt_version: string;
}

export interface Candidate {
  match_id: string;
  external_id: string;
  home_team: string;
  away_team: string;
  competition: string;
  country: string;
  match_date: string;
  recommended_market: BettingMarket;
  odds: number;
  estimated_probability: number;
  confidence_score: number;
  risk: RiskLevel;
  statistical_convergence: number;
  scoring_breakdown: {
    goals_score: number;
    market_score: number;
    form_score: number;
    home_away_score: number;
    goals_avg_score: number;
    convergence_score: number;
    h2h_score: number;
    data_quality_score: number;
    penalties: number;
    total_score: number;
  };
}

export interface ComboSelection {
  id?: string;
  combo_id?: string;
  match_id: string;
  home_team: string;
  away_team: string;
  competition: string;
  market: BettingMarket;
  odds: number;
  estimated_probability: number;
  confidence_score: number;
  selection_order: number;
}

export interface DailyCombo {
  id?: string;
  analysis_date: string;
  status: ComboStatus;
  number_of_matches: number;
  total_odds: number | null;
  theoretical_probability: number | null;
  confidence_score: number;
  risk: RiskLevel;
  selections: ComboSelection[];
  model_version: string;
  prompt_version: string;
  algorithm_version: string;
  no_combo_reason?: string | null;
  created_at?: string;
}

export interface PredictionResult {
  id?: string;
  selection_id: string;
  actual_score: string;
  actual_result: {
    total_goals: number;
    btts: boolean;
    over_2_5: boolean;
  };
  won: boolean;
  verified_at: string;
}

export interface SystemPerformanceMetrics {
  total_combos_generated: number;
  no_combo_count: number;
  combos_evaluated: number;
  combos_won: number;
  combos_lost: number;
  win_rate: number;
  roi: number;
  average_odds: number;
  over_2_5_win_rate: number;
  btts_win_rate: number;
  brier_score: number;
  performance_by_competition: Record<string, { total: number; won: number; win_rate: number }>;
}

