-- ==============================================================================
-- BETPULSE AI - SEED DATA FOR LOCAL / STAGING ENVIRONMENTS
-- ==============================================================================

-- Insert Sample Matches
INSERT INTO matches (id, external_id, home_team, away_team, competition, country, match_date, status, source)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'bst_pl_2026_01', 'Arsenal', 'Brighton & Hove Albion', 'Premier League', 'England', now() + interval '4 hours', 'SCHEDULED', 'BETSTUDY'),
    ('a0000000-0000-0000-0000-000000000002', 'bst_bundes_2026_01', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Bundesliga', 'Germany', now() + interval '5 hours', 'SCHEDULED', 'BETSTUDY'),
    ('a0000000-0000-0000-0000-000000000003', 'bst_laliga_2026_01', 'Villarreal', 'Real Sociedad', 'La Liga', 'Spain', now() + interval '6 hours', 'SCHEDULED', 'BETSTUDY')
ON CONFLICT (external_id) DO NOTHING;

-- Insert Match Statistics
INSERT INTO match_statistics (match_id, goals_average, home_goals_average, away_goals_average, over_1_5, over_2_5, over_3_5, btts, home_over_2_5, away_over_2_5, home_btts, away_btts, home_scored_average, away_scored_average, home_conceded_average, away_conceded_average, raw_data)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 3.20, 2.40, 1.60, 0.90, 0.75, 0.45, 0.70, 0.80, 0.70, 0.70, 0.70, 2.40, 1.50, 0.80, 1.70, '{"source": "betstudy"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000002', 3.60, 2.60, 1.80, 0.95, 0.82, 0.55, 0.75, 0.85, 0.80, 0.75, 0.75, 2.60, 1.70, 1.00, 1.90, '{"source": "betstudy"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000003', 2.90, 1.80, 1.50, 0.85, 0.68, 0.35, 0.65, 0.70, 0.65, 0.65, 0.65, 1.80, 1.40, 1.10, 1.50, '{"source": "betstudy"}'::jsonb)
ON CONFLICT (match_id) DO NOTHING;

-- Insert Match Odds
INSERT INTO match_odds (match_id, over_2_5_odds, btts_yes_odds, source)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 1.55, 1.65, 'BETSTUDY'),
    ('a0000000-0000-0000-0000-000000000002', 1.48, 1.52, 'BETSTUDY'),
    ('a0000000-0000-0000-0000-000000000003', 1.52, 1.60, 'BETSTUDY');

-- Insert Sample Daily Combo
INSERT INTO daily_combos (id, analysis_date, status, number_of_matches, total_odds, theoretical_probability, confidence_score, risk, model_version, prompt_version, algorithm_version)
VALUES
    ('c0000000-0000-0000-0000-000000000001', CURRENT_DATE, 'PUBLISHED', 3, 3.48, 0.4285, 86, 'MODERATE', 'gpt-4o', 'v2.4', 'v1.0.0')
ON CONFLICT (analysis_date) DO NOTHING;

-- Insert Combo Selections
INSERT INTO combo_selections (combo_id, match_id, competition, market, odds, estimated_probability, confidence_score, selection_order)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Premier League', 'OVER_2_5', 1.55, 0.76, 88, 1),
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Bundesliga', 'OVER_2_5', 1.48, 0.78, 89, 2),
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'La Liga', 'BTTS_YES', 1.52, 0.72, 82, 3);

