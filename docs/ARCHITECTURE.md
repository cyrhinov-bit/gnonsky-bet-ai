# BetPulse AI — Architecture & Documentation Technique

## 1. Vue d'ensemble

BetPulse AI est une plateforme d'intelligence quantitative dédiée aux prédictions et à la sélection de combinés football basées exclusivement sur les données publiques de **BetStudy.com**.

Le système suit la règle fondamentale : **UN SEUL COMBINÉ DU JOUR (3 à 5 matchs, championnats uniques, marchés Over 2.5 ou BTTS uniquement, cotes $\ge 1.25$)** ou **NO_COMBO** pour protéger le capital.

---

## 2. Structure du Monorepo

* **`apps/mobile`** : Application mobile React Native / Expo (SDK 52), multiplateforme (iOS & Android).
* **`apps/web`** : Application Web Progressive Web App (PWA) construite avec React, TypeScript, Vite, Tailwind CSS et `vite-plugin-pwa`.
* **`apps/api`** : API REST Node.js & TypeScript modulaire avec endpoints d'orchestration, d'administration et de jobs automatisés.
* **`packages/types`** : Définitions et modèles de domaine partagés (`Match`, `Candidate`, `DailyCombo`, `PredictionResult`).
* **`packages/validation`** : Schémas Zod pour la validation stricte des données et des sorties IA.
* **`packages/scoring`** : Moteur mathématique déterministe de scoring et calcul composé de cotes et probabilités.
* **`packages/prompts`** : Prompts systèmes OpenAI stricts avec obligation de comparaison Over 2.5 vs BTTS.
* **`packages/ui`** : Tokens graphiques et charte de design *BetPulse Precision*.
* **`supabase/migrations`** : Schémas relationnels SQL PostgreSQL avec RLS et contraintes d'unicité.

---

## 3. Pipeline Quotidien

```text
1. BetStudy Collector    -> Scrape les données publiques sans inventer de données.
2. Data Normalizer       -> Convertit les statistiques en format canonique.
3. Data Validator        -> Validation stricte des schémas et détection des doublons.
4. Pre-Filter Engine     -> Élimine les matchs non admissibles (cotes < 1.25, matchs commencés).
5. AI Analysis Engine    -> OpenAI GPT en mode JSON strict (comparaison Over 2.5 vs BTTS).
6. Scoring Engine        -> Calcul pondéré (25% buts, 20% marché, 15% forme, pénalités).
7. Candidate Engine      -> Classement ordonné des candidats admissibles.
8. Combo Selector        -> Sélectionne 3 à 5 matchs (1 par ligue) ou déclenche NO_COMBO.
9. Final Validator       -> Gatekeeper recalculant les cotes totales et probabilités composées.
10. Publication & DB     -> Persistance dans Supabase et exposition via l'API REST.
```

