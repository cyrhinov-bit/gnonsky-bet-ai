-- ==============================================================================
-- BETPULSE AI - SUPABASE / POSTGRESQL INITIAL SCHEMA MIGRATION
-- Migration Version: 20260911000000_initial_schema.sql
-- Description: Complete tables, indexes, constraints, and RLS policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLE: matches
-- ==============================================================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT NOT NULL UNIQUE,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    competition TEXT NOT NULL,
    country TEXT NOT NULL,
    match_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PLAY', 'FINISHED', 'POSTPONED', 'CANCELLED')),
    source TEXT NOT NULL DEFAULT 'BETSTUDY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_external_id ON matches(external_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_competition ON matches(competition);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- ==============================================================================
-- 2. TABLE: match_statistics
-- ==============================================================================
CREATE TABLE IF NOT EXISTS match_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
    
    -- Goal averages
    goals_average NUMERIC(4,2),
    home_goals_average NUMERIC(4,2),
    away_goals_average NUMERIC(4,2),
    
    -- Target markets frequencies (percentages between 0 and 1)
    over_1_5 NUMERIC(4,2),
    over_2_5 NUMERIC(4,2),
    over_3_5 NUMERIC(4,2),
    btts NUMERIC(4,2),
    
    -- Home / Away detailed frequencies
    home_over_2_5 NUMERIC(4,2),
    away_over_2_5 NUMERIC(4,2),
    home_btts NUMERIC(4,2),
    away_btts NUMERIC(4,2),
    
    -- Scoring/Conceding averages
    home_scored_average NUMERIC(4,2),
    away_scored_average NUMERIC(4,2),
    home_conceded_average NUMERIC(4,2),
    away_conceded_average NUMERIC(4,2),
    
    -- Recent form & H2H history
    recent_form JSONB DEFAULT '[]'::jsonb,
    home_form JSONB DEFAULT '[]'::jsonb,
    away_form JSONB DEFAULT '[]'::jsonb,
    h2h_data JSONB DEFAULT '[]'::jsonb,
    
    -- Computer prediction from BetStudy
    computer_prediction JSONB,
    
    -- Data quality and quantity metrics (0 to 100)
    data_quality NUMERIC(4,2) DEFAULT 100.0,
    data_quantity NUMERIC(4,2) DEFAULT 100.0,
    
    -- Raw captured payload
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_statistics_match_id ON match_statistics(match_id);

-- ==============================================================================
-- 3. TABLE: match_odds
-- ==============================================================================
CREATE TABLE IF NOT EXISTS match_odds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    over_2_5_odds NUMERIC(5,2),
    btts_yes_odds NUMERIC(5,2),
    source TEXT NOT NULL DEFAULT 'BETSTUDY',
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_odds_match_id ON match_odds(match_id);
CREATE INDEX IF NOT EXISTS idx_match_odds_captured_at ON match_odds(captured_at);

-- ==============================================================================
-- 4. TABLE: ai_match_analysis
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ai_match_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    over_2_5_probability NUMERIC(4,2) NOT NULL,
    btts_probability NUMERIC(4,2) NOT NULL,
    recommended_market TEXT NOT NULL CHECK (recommended_market IN ('OVER_2_5', 'BTTS_YES')),
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    risk TEXT NOT NULL CHECK (risk IN ('LOW', 'MODERATE', 'HIGH')),
    statistical_convergence NUMERIC(4,2) DEFAULT 0.0,
    contradictions JSONB NOT NULL DEFAULT '[]'::jsonb,
    anomalies JSONB NOT NULL DEFAULT '[]'::jsonb,
    include_candidate BOOLEAN NOT NULL DEFAULT false,
    exclusion_reason TEXT,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_match_analysis_match_id ON ai_match_analysis(match_id);
CREATE INDEX IF NOT EXISTS idx_ai_match_analysis_include_candidate ON ai_match_analysis(include_candidate);

-- ==============================================================================
-- 5. TABLE: daily_combos
-- ==============================================================================
CREATE TABLE IF NOT EXISTS daily_combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_date DATE NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('PUBLISHED', 'NO_COMBO', 'VALIDATION_ERROR')),
    number_of_matches INTEGER NOT NULL DEFAULT 0,
    total_odds NUMERIC(6,2),
    theoretical_probability NUMERIC(5,4),
    confidence_score INTEGER NOT NULL DEFAULT 0,
    risk TEXT NOT NULL DEFAULT 'MODERATE' CHECK (risk IN ('LOW', 'MODERATE', 'HIGH')),
    model_version TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    algorithm_version TEXT NOT NULL,
    no_combo_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_combos_analysis_date ON daily_combos(analysis_date);
CREATE INDEX IF NOT EXISTS idx_daily_combos_status ON daily_combos(status);

-- ==============================================================================
-- 6. TABLE: combo_selections
-- ==============================================================================
CREATE TABLE IF NOT EXISTS combo_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id UUID NOT NULL REFERENCES daily_combos(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES matches(id),
    competition TEXT NOT NULL,
    market TEXT NOT NULL CHECK (market IN ('OVER_2_5', 'BTTS_YES')),
    odds NUMERIC(5,2) NOT NULL CHECK (odds >= 1.25),
    estimated_probability NUMERIC(4,2) NOT NULL,
    confidence_score INTEGER NOT NULL,
    selection_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_combo_selections_combo_id ON combo_selections(combo_id);
CREATE INDEX IF NOT EXISTS idx_combo_selections_match_id ON combo_selections(match_id);

-- ==============================================================================
-- 7. TABLE: prediction_results
-- ==============================================================================
CREATE TABLE IF NOT EXISTS prediction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    selection_id UUID NOT NULL REFERENCES combo_selections(id) ON DELETE CASCADE UNIQUE,
    actual_score TEXT,
    actual_result JSONB NOT NULL DEFAULT '{}'::jsonb,
    won BOOLEAN NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prediction_results_selection_id ON prediction_results(selection_id);
CREATE INDEX IF NOT EXISTS idx_prediction_results_won ON prediction_results(won);

-- ==============================================================================
-- 8. TABLE: system_logs
-- ==============================================================================
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG')),
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_logs_module ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_match_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (for Web and Mobile apps)
CREATE POLICY "Allow public read access to matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access to match_statistics" ON match_statistics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to match_odds" ON match_odds FOR SELECT USING (true);
CREATE POLICY "Allow public read access to daily_combos" ON daily_combos FOR SELECT USING (true);
CREATE POLICY "Allow public read access to combo_selections" ON combo_selections FOR SELECT USING (true);
CREATE POLICY "Allow public read access to prediction_results" ON prediction_results FOR SELECT USING (true);

-- Service Role Full Access Policies (for Backend Node API)
CREATE POLICY "Service role full access on matches" ON matches USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on match_statistics" ON match_statistics USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on match_odds" ON match_odds USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on ai_match_analysis" ON ai_match_analysis USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on daily_combos" ON daily_combos USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on combo_selections" ON combo_selections USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on prediction_results" ON prediction_results USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on system_logs" ON system_logs USING (auth.role() = 'service_role');

