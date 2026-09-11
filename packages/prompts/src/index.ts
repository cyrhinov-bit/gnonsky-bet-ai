import { NormalizedMatch } from '@football/types';

export const PROMPT_VERSION = 'v2.4.0';

export const SYSTEM_MATCH_ANALYSIS_PROMPT = `
Tu es un moteur d'analyse quantitative expert en football et prédictions statistiques pour Gnonsky Bet AI.
Ta mission est d'analyser EXCLUSIVEMENT les données statistiques fournies issues de BetStudy.com.

RÈGLES STRICTES :
1. Tu ne dois JAMAIS inventer une donnée manquante. Si une donnée est null, prends-la en compte comme inconnue.
2. Tu dois OBLIGATOIREMENT comparer les deux marchés cibles : 'OVER_2_5' et 'BTTS_YES'.
3. Tu dois choisir UN SEUL marché recommandé : soit 'OVER_2_5', soit 'BTTS_YES'. Jamais les deux simultanément.
4. Tu dois calculer une probabilité estimée rigoureuse (entre 0.0 et 1.0) pour chaque marché.
5. Tu dois évaluer le risque ('LOW', 'MODERATE', 'HIGH') et le score de confiance (0 à 100).
6. Identifie toute contradiction (ex: équipe n'encaissant pas mais cote BTTS très basse) ou anomalie.
7. Détermine si le match est un candidat valide (include_candidate: true/false). Si false, fournis la raison d'exclusion.
8. Tu dois répondre STRICTEMENT au format JSON sans aucun texte libre autour.

SCHEMA DE SORTIE ATTENDU :
{
  "match_id": string,
  "over_2_5_probability": number, // entre 0.0 et 1.0
  "btts_probability": number,     // entre 0.0 et 1.0
  "recommended_market": "OVER_2_5" | "BTTS_YES",
  "confidence_score": number,     // entier de 0 à 100
  "risk": "LOW" | "MODERATE" | "HIGH",
  "statistical_convergence": number, // entre 0.0 et 1.0
  "contradictions": string[],
  "anomalies": string[],
  "include_candidate": boolean,
  "exclusion_reason": string | null
}
`;

export function generateMatchUserPrompt(match: NormalizedMatch): string {
  return JSON.stringify({
    match_id: match.match_id,
    external_id: match.external_id,
    teams: {
      home: match.home_team,
      away: match.away_team
    },
    competition: match.competition,
    country: match.country,
    match_date: match.match_date,
    available_odds: {
      over_2_5: match.odds.over_2_5,
      btts_yes: match.odds.btts_yes
    },
    statistics: {
      goals_average: match.statistics.goals_average,
      home_goals_average: match.statistics.home_goals_average,
      away_goals_average: match.statistics.away_goals_average,
      over_1_5_freq: match.statistics.over_1_5,
      over_2_5_freq: match.statistics.over_2_5,
      over_3_5_freq: match.statistics.over_3_5,
      btts_freq: match.statistics.btts,
      home_over_2_5: match.statistics.home_over_2_5,
      away_over_2_5: match.statistics.away_over_2_5,
      home_btts: match.statistics.home_btts,
      away_btts: match.statistics.away_btts,
      home_scored_average: match.statistics.home_scored_average,
      away_scored_average: match.statistics.away_scored_average,
      home_conceded_average: match.statistics.home_conceded_average,
      away_conceded_average: match.statistics.away_conceded_average,
      recent_form: match.statistics.recent_form,
      h2h_data: match.statistics.h2h_data,
      computer_prediction: match.statistics.computer_prediction,
      data_quality: match.statistics.data_quality,
      data_quantity: match.statistics.data_quantity
    }
  }, null, 2);
}

