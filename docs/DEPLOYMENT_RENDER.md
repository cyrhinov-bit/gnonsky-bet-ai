# Guide de Déploiement Render.com — Gnonsky Bet AI

Ce projet monorepo est pré-configuré pour un déploiement clé en main sur [Render.com](https://render.com).

Grâce à notre architecture unifiée, un **seul Web Service gratuit Render** héberge simultanément l'API Backend Node.js, le pipeline de scraping BetStudy, l'IA et l'application Web PWA React.

---

## 🚀 Méthode 1 : Déploiement Automatique via Blueprint (`render.yaml`)

1. Poussez votre code sur votre repository **GitHub** ou **GitLab** :
   ```bash
   git add .
   git commit -m "feat: setup Render deployment"
   git push origin main
   ```
2. Rendez-vous sur [dashboard.render.com](https://dashboard.render.com).
3. Cliquez sur **New +** > **Blueprint**.
4. Connectez votre repository Git.
5. Render détectera automatiquement le fichier [`render.yaml`](../render.yaml).
6. Renseignez les variables d'environnement secrètes demandées :
   - `OPENAI_API_KEY` : Votre clé OpenAI (`sk-...`)
   - `SUPABASE_ANON_KEY` : Votre clé publique Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` : Votre clé secrète de service Supabase
7. Cliquez sur **Apply**. Le build et le déploiement se lancent automatiquement !

---

## 🛠️ Méthode 2 : Création Manuelle d'un Web Service sur Render

Si vous préférez créer le service manuellement dans l'interface Render :

1. Cliquez sur **New +** > **Web Service**.
2. Connectez votre dépôt GitHub.
3. Configurez les paramètres suivants :
   - **Name :** `gnonsky-bet-ai`
   - **Region :** `Frankfurt (EU Central)` (ou votre choix)
   - **Branch :** `main`
   - **Root Directory :** *(Laisser vide)*
   - **Runtime :** `Node`
   - **Build Command :** `npm install && npm run build`
   - **Start Command :** `npm run start --workspace=apps/api`
   - **Plan :** `Free`

4. Ajoutez les **Environment Variables** dans l'onglet *Environment* :
   | Clé | Valeur |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `OPENAI_MODEL` | `gpt-4o` |
   | `OPENAI_API_KEY` | `sk-...` |
   | `SUPABASE_URL` | `https://wihwpztbsvvezecdvtne.supabase.co` |
   | `SUPABASE_ANON_KEY` | *(Votre clé Supabase anon)* |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(Votre clé Supabase service_role)* |
   | `JWT_SECRET` | `jwt-secret-key-gnonsky-bet-ai-32chars` |
   | `ADMIN_API_KEY` | `admin-secret-key-123` |
   | `CRON_SCHEDULE` | `0 8 * * *` |

5. Cliquez sur **Create Web Service**.

---

## 🌐 URLs & Accès une fois Déployé

Une fois le déploiement terminé (environ 2-3 minutes) :
- **URL publique de l'application :** `https://gnonsky-bet-ai.onrender.com`
- **Code d'accès :** `M@jorix90`
- **Health Check :** `https://gnonsky-bet-ai.onrender.com/health`
- **API Combiné du Jour :** `https://gnonsky-bet-ai.onrender.com/api/combo/today`

