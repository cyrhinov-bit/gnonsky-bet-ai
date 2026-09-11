# BetPulse AI — Monorepo (Mobile React Native / Expo, Web PWA, API Node.js & Moteur IA)

Système de prédiction quantitative et sélection de combinés football alimenté exclusivement par les données de **BetStudy.com**.

---

## 🚀 Fonctionnalités Clés

- **Monorepo Complet** : Applications Web PWA (React / Vite / Tailwind) & Mobile (React Native / Expo SDK 52) partageant les packages `@football/types`, `@football/validation`, `@football/scoring`, `@football/prompts`, `@football/ui`.
- **Règle Fondamentale du Combiné Unique** : Production d'un unique combiné quotidien (3 à 5 sélections, cotes $\ge 1.25$, 1 match max par championnat, marchés exclusifs `OVER_2_5` ou `BTTS_YES`).
- **Discipline Mathématique Stricte & `NO_COMBO`** : Déclenchement automatique de `NO_COMBO` si moins de 3 sélections respectent les seuils de probabilité, de confiance et de valeur.
- **Source Exclusive BetStudy.com** : Scraper et extracteur de données publiques sans extrapolation arbitraire.
- **Moteur IA OpenAI & Fallback Déterministe** : Analyse comparative systématique entre Over 2.5 et BTTS Oui avec sortie JSON validée par Zod.
- **Sécurité & Base de Données Supabase** : PostgreSQL avec contraintes d'unicité, RLS et traçabilité complète des versions d'algorithme.
- **Design System BetPulse Precision** : Typographie Space Grotesk, Hanken Grotesk, JetBrains Mono, palette Bleu Royal (`#1D4ED8`), Orange (`#EA580C`) et Violet (`#7C3AED`).

---

## 📁 Architecture des Dossiers

```text
football-predictor/
├── apps/
│   ├── mobile/             # React Native (Expo SDK 52)
│   ├── web/                # React 18, Vite & PWA
│   └── api/                # API REST Node.js & TypeScript
├── packages/
│   ├── types/              # Modèles TypeScript partagés
│   ├── validation/         # Schémas Zod
│   ├── scoring/            # Moteur de scoring mathématique
│   ├── prompts/            # Prompts système OpenAI
│   └── ui/                 # Tokens du Design System
├── supabase/
│   ├── migrations/         # Migrations SQL PostgreSQL
│   └── seed/               # Données de test
├── tests/                  # Tests unitaires et d'intégration
└── docs/                   # Spécifications et guides
```

---

## 🛠️ Démarrage Rapide

1. Copiez les variables d'environnement :
   `cp .env.example .env`
2. Installez les dépendances :
   `npm install`
3. Lancez les services :
   - Web PWA : `npm run dev:web`
   - API Backend : `npm run dev:api`
   - Mobile Expo : `npm run dev:mobile`

