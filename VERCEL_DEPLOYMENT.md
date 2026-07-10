# Guide de Déploiement du Projet JET Services sur Vercel

**Auteur :** Manus AI

**Date :** 10 juillet 2026

## Introduction

Ce document fournit un guide détaillé pour le déploiement du projet **JET Services**, une application full-stack utilisant React 19, Tailwind 4, Express 4, tRPC 11 et Drizzle ORM, sur la plateforme Vercel. L'architecture a été adaptée pour tirer parti des fonctions serverless de Vercel, garantissant ainsi une scalabilité et une gestion optimisées.

## 1. Architecture Adaptée pour Vercel

Le projet JET Services a été configuré pour s'aligner sur les meilleures pratiques de déploiement de Vercel, qui privilégie les fonctions serverless pour le backend et le service de fichiers statiques pour le frontend. La structure est la suivante :

*   **Frontend :** L'interface utilisateur, développée avec React 19 et Vite, est compilée en un ensemble de fichiers statiques. Ces fichiers sont servis directement par le CDN de Vercel, assurant des performances optimales.
*   **Backend :** Le serveur Express, qui gère les API tRPC, OAuth et le proxy de stockage, est transformé en une fonction serverless Vercel. Cette approche permet une exécution à la demande, réduisant les coûts et améliorant la scalabilité.
*   **Configuration :** Le fichier `vercel.json` orchestre le processus de build, l'installation des dépendances, et définit les règles de réécriture d'URL pour acheminer les requêtes API vers la fonction serverless appropriée.

### 1.1. Structure des Fichiers Clés

Le projet est organisé comme suit pour faciliter le déploiement sur Vercel :

```
project/
├── api/
│   └── index.js              # Point d'entrée de la fonction serverless (Express app)
├── client/
│   └── src/                  # Code source du frontend React
├── server/
│   ├── _core/               # Fichiers de configuration et middlewares Express
│   ├── routers.ts           # Définitions des procédures tRPC
│   └── db.ts                # Helpers pour l'accès à la base de données
├── dist/
│   └── public/              # Répertoire de sortie du build frontend (fichiers statiques)
├── vercel.json              # Fichier de configuration Vercel
└── .vercelignore            # Fichiers et répertoires à exclure du déploiement Vercel
```

### 1.2. Flux de Requête sur Vercel

Le diagramme ci-dessous illustre le cheminement d'une requête utilisateur à travers l'infrastructure Vercel :

```mermaid
graph TD
    A[Requête Utilisateur] --> B(Vercel CDN)
    B --> C{Type de Requête?}
    C -- Fichiers Statiques (ex: /index.html, /assets/*) --> D[Service Direct par CDN]
    C -- Requêtes API (ex: /api/*) --> E[Fonction Serverless Vercel]
    E --> F[Express App (api/index.js)]
    F -- /api/trpc/* --> G[Procédures tRPC]
    F -- /api/oauth/* --> H[Routes OAuth]
    F -- /api/storage/* --> I[Proxy de Stockage]
    F -- /health --> J[Endpoint Health Check]
```

## 2. Prérequis au Déploiement

Avant de procéder au déploiement, assurez-vous de disposer des éléments suivants :

*   Un compte Vercel actif [1].
*   Un dépôt GitHub contenant le code source du projet JET Services [2].
*   Toutes les variables d'environnement nécessaires configurées dans Vercel.

## 3. Étapes de Déploiement

### 3.1. Préparation du Dépôt GitHub

Assurez-vous que toutes les modifications locales sont poussées vers votre dépôt GitHub. Vercel se synchronisera avec ce dépôt pour le déploiement.

```bash
git add .
git commit -m "Préparation pour le déploiement Vercel"
git push origin main
```

### 3.2. Connexion de Vercel à GitHub

1.  Accédez à votre tableau de bord Vercel : [https://vercel.com/dashboard][1].
2.  Cliquez sur le bouton **"Add New..."** puis sélectionnez **"Project"**.
3.  Choisissez votre dépôt GitHub dans la liste des dépôts disponibles.
4.  Vercel détectera automatiquement la configuration du projet grâce au fichier `vercel.json`.

### 3.3. Configuration des Variables d'Environnement

Les variables d'environnement sont cruciales pour le bon fonctionnement de l'application. Elles doivent être configurées dans le tableau de bord Vercel sous **Settings → Environment Variables**.

#### Variables Obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Chaîne de connexion MySQL/TiDB pour la base de données. | `mysql://user:password@host:port/database` |
| `JWT_SECRET` | Clé secrète utilisée pour la signature des tokens JWT de session. Doit être une chaîne de caractères longue et complexe (minimum 32 caractères). | `your-secret-key-min-32-chars` |
| `VITE_APP_ID` | ID de l'application OAuth pour l'authentification. | `your-oauth-app-id` |
| `OAUTH_SERVER_URL` | URL de base du serveur OAuth. | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL du portail de connexion OAuth pour le frontend. | `https://oauth.manus.im` |
| `OWNER_OPEN_ID` | OpenID du propriétaire du projet. | `owner-id` |
| `OWNER_NAME` | Nom du propriétaire du projet. | `Your Name` |
| `BUILT_IN_FORGE_API_URL` | URL des APIs Manus intégrées. | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Clé API pour les APIs Manus intégrées (utilisée côté serveur). | `your-api-key` |
| `VITE_FRONTEND_FORGE_API_URL` | URL des APIs Manus intégrées pour le frontend. | `https://api.manus.im` |
| `VITE_FRONTEND_FORGE_API_KEY` | Clé API pour les APIs Manus intégrées (utilisée côté frontend). | `your-frontend-api-key` |

#### Variables Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clé secrète de l'API Stripe pour les transactions. |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature des webhooks Stripe. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique de Stripe pour le frontend. |

#### Variables Optionnelles

| Variable | Description |
|----------|-------------|
| `SENDGRID_API_KEY` | Clé API SendGrid pour l'envoi d'emails transactionnels. |
| `VITE_ANALYTICS_ENDPOINT` | URL de l'endpoint pour les services d'analyse. |
| `VITE_ANALYTICS_WEBSITE_ID` | ID du site web pour les services d'analyse. |

### 3.4. Déploiement Initial

Une fois les variables d'environnement configurées, Vercel lancera automatiquement le processus de déploiement. Ce processus inclut :

*   La construction du frontend avec Vite.
*   La création de la fonction serverless pour le backend.
*   Le déploiement des assets statiques.

Votre application sera accessible via une URL générée par Vercel, typiquement `https://your-project.vercel.app`.

## 4. Configuration Détaillée

### 4.1. `vercel.json`

Le fichier `vercel.json` est le cœur de la configuration de déploiement sur Vercel. Il spécifie :

*   **`buildCommand`** : `pnpm build` – Cette commande est exécutée pour compiler le frontend React en fichiers statiques.
*   **`installCommand`** : `pnpm install` – Installe toutes les dépendances du projet.
*   **`framework`** : `vite` – Permet à Vercel de détecter et d'optimiser le build pour les projets Vite.
*   **`functions`** : Configure le runtime Node.js 20.x pour les fonctions serverless situées dans le répertoire `api/`.
*   **`rewrites`** : Redirige toutes les requêtes commençant par `/api/` vers le point d'entrée de la fonction serverless `api/index.js`.

### 4.2. `api/index.js`

Ce fichier sert de point d'entrée pour la fonction serverless Vercel. Il est responsable de :

1.  L'initialisation de l'application Express.
2.  La configuration des middlewares de sécurité (monitoring, rate limiting).
3.  L'enregistrement des routes spécifiques (OAuth, proxy de stockage, tRPC).
4.  Le service des fichiers statiques du frontend (après le build).
5.  L'exportation de l'instance Express pour que Vercel puisse l'utiliser comme fonction serverless.

## 5. Considérations Importantes pour Vercel

### 5.1. Démarrage à Froid (Cold Start)

Les fonctions serverless peuvent expérimenter un **délai initial** lors de leur premier appel après une période d'inactivité. Ce phénomène, appelé *cold start*, est inhérent à l'architecture serverless. Vercel optimise ces démarrages, mais il est important d'en être conscient. Les requêtes ultérieures sont généralement beaucoup plus rapides.

### 5.2. Limites de Vercel

Il est essentiel de connaître les limites de la plateforme Vercel pour éviter les problèmes de déploiement ou de performance [3] :

| Caractéristique | Plan Gratuit | Plan Pro |
|-----------------|--------------|----------|
| **Timeout**     | 60 secondes  | 900 secondes |
| **Mémoire**     | 3 GB         | 3 GB |
| **Taille du bundle** | 250 MB       | 250 MB |
| **Concurrence** | Scalable automatiquement | Scalable automatiquement |

### 5.3. Base de Données

Vercel ne fournit pas de service de base de données. Vous devrez utiliser un service de base de données externe compatible avec MySQL/TiDB, tel que :

*   **TiDB Cloud** (fortement recommandé pour sa compatibilité MySQL et sa scalabilité)
*   **PlanetScale**
*   **AWS RDS**
*   **DigitalOcean Managed Database**
*   Tout autre service MySQL ou PostgreSQL managé.

### 5.4. Stockage de Fichiers

Le stockage local n'est pas persistant sur Vercel. Pour la gestion des fichiers (images, documents, etc.), il est impératif d'utiliser un service de stockage cloud. Le projet est déjà configuré pour utiliser :

*   **AWS S3** (actuellement intégré et recommandé)
*   D'autres options incluent Cloudinary, Supabase Storage, ou Google Cloud Storage.

## 6. Dépannage Courant

Cette section aborde les problèmes fréquemment rencontrés lors du déploiement sur Vercel et leurs solutions :

*   **Erreur : "Cannot find module"**
    *   **Solution :** Assurez-vous que toutes les dépendances sont correctement installées. Vérifiez les logs de build sur Vercel pour identifier les modules manquants. Il peut être nécessaire d'ajouter des dépendances manquantes au `package.json` ou de s'assurer que `pnpm install` s'exécute sans erreur.

*   **Erreur : "DATABASE_URL not set"**
    *   **Solution :** Cette erreur indique que la variable d'environnement `DATABASE_URL` n'est pas définie. Ajoutez-la dans les **Environment Variables** de votre projet Vercel (voir section 3.3).

*   **Erreur : "Cold start timeout"**
    *   **Solution :** Si vos fonctions serverless dépassent le temps d'exécution alloué, cela peut être dû à un *cold start* trop long ou à des opérations coûteuses. Optimisez le code de vos fonctions pour réduire le temps de démarrage et d'exécution. Vercel permet d'augmenter le timeout pour les plans Pro.

*   **Erreur : "CORS origin not allowed"**
    *   **Solution :** Si vous rencontrez des problèmes de CORS, assurez-vous que `VITE_OAUTH_PORTAL_URL` et `OAUTH_SERVER_URL` sont correctement configurés avec le domaine de votre application Vercel. Vous devrez peut-être ajuster les configurations CORS dans votre application Express pour autoriser votre domaine Vercel.

## 7. Commandes Utiles

Pour interagir avec Vercel depuis votre terminal, vous pouvez utiliser l'outil `vercel CLI` :

```bash
# Installer Vercel CLI globalement
npm i -g vercel

# Déployer le projet localement (pour tester avant la production)
vercel

# Déployer le projet en production
vercel --prod

# Afficher les logs de déploiement et d'exécution
vercel logs

# Lister les variables d'environnement configurées
vercel env ls
```

## 8. Optimisations Recommandées

Pour améliorer les performances et l'expérience utilisateur de votre application sur Vercel :

### 8.1. Activer la Mise en Cache pour les Fichiers Statiques

Vous pouvez configurer des en-têtes de cache pour les fichiers statiques directement dans `vercel.json` afin d'améliorer la vitesse de chargement et de réduire la charge sur le serveur :

```json
{
  "headers": [
    {
      "source": "/dist/public/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 8.2. Utiliser les Régions Vercel

Configurez les régions de déploiement dans les **Settings → Regions** de votre projet Vercel pour servir votre application depuis des emplacements géographiques proches de vos utilisateurs, réduisant ainsi la latence.

### 8.3. Monitoring avec Vercel Analytics

Activez Vercel Analytics dans les **Settings → Analytics** pour obtenir des informations détaillées sur les performances, le trafic et les erreurs de votre application.

## 9. Support et Références

Pour toute question ou problème, veuillez consulter les ressources suivantes :

*   **Documentation Vercel :** [https://vercel.com/docs][1]
*   **Déploiement tRPC sur Vercel :** [https://trpc.io/docs/deployment/vercel][4]
*   **Support Vercel :** [https://vercel.com/support][5]

## Références

[1] Vercel. *Vercel Dashboard*. Disponible sur : [https://vercel.com/dashboard](https://vercel.com/dashboard)
[2] GitHub. *Your GitHub Repository*. Disponible sur : [https://github.com/your-username/your-repo](https://github.com/your-username/your-repo)
[3] Vercel. *Vercel Platform Limits*. Disponible sur : [https://vercel.com/docs/platform/limits](https://vercel.com/docs/platform/limits)
[4] tRPC. *Deployment on Vercel*. Disponible sur : [https://trpc.io/docs/deployment/vercel](https://trpc.io/docs/deployment/vercel)
[5] Vercel. *Vercel Support*. Disponible sur : [https://vercel.com/support](https://vercel.com/support)
