# Guide de Déploiement & Configuration

## 1. Pré-requis

* Node.js v20+ & npm / pnpm
* Un projet PostgreSQL / Supabase
* Une clé d'API OpenAI (pour le moteur `gpt-4o`)

---

## 2. Configuration des Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
PORT=4000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI
OPENAI_API_KEY=sk-proj-your-openai-key
OPENAI_MODEL=gpt-4o

# BetStudy
BETSTUDY_BASE_URL=https://www.betstudy.com
ADMIN_API_KEY=votre-cle-secrete-admin-api
```

---

## 3. Déploiement de la Base Supabase

Appliquez la migration SQL située dans :
`supabase/migrations/20260911000000_initial_schema.sql`

---

## 4. Lancement Local & Développement

```bash
# Installer les dépendances
npm install

# Lancer le backend API
npm run dev:api

# Lancer la Web PWA
npm run dev:web

# Lancer l'application Mobile Expo
npm run dev:mobile
```

