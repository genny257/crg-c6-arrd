# Plateforme de Gestion de la Croix-Rouge Gabonaise (Comité 6e Arr.)

Bienvenue sur la plateforme de gestion de la Croix-Rouge Gabonaise pour le comité du 6ème arrondissement. Cette application est conçue pour optimiser la gestion des volontaires, des missions, des dons et des communications.

**Propriété** : Cette plateforme a été développée par **TechGa**, qui en est l'unique propriétaire.

## Stack Technique

-   **Framework Frontend**: [Next.js](https://nextjs.org/) (avec App Router)
-   **Langage**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Composants UI**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Backend**: Serveur Node.js avec Express, Prisma et une base de données PostgreSQL.
-   **IA & Logique Métier**: [Genkit (Firebase GenAI)](https://firebase.google.com/docs/genkit)
-   **Authentification**: JWT avec un fournisseur de informations d'identification personnalisé.

---

## Instructions de Configuration et de Déploiement

Suivez ces étapes pour configurer et lancer le projet en environnement de développement ou de production.

### 1. Prérequis

-   Node.js (version 20 ou supérieure recommandée)
-   npm ou yarn
-   Git
-   Une base de données PostgreSQL

### 2. Téléchargement et Installation

Clonez le dépôt et installez les dépendances pour le frontend et le backend.

```bash
# Cloner le projet
git clone [URL_DU_DEPOT]
cd [NOM_DU_DOSSIER_PROJET]

# Installer les dépendances du frontend (Next.js)
npm install

# Installer les dépendances du backend (API)
cd api
npm install
cd ..
```

### 3. Configuration des Variables d'Environnement

Deux fichiers `.env` doivent être configurés : un à la racine pour le frontend et un dans le dossier `/api` pour le backend.

-   **Frontend (`./.env`)** :
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    NEXTAUTH_URL=http://localhost:9003
    NEXTAUTH_SECRET=[GENERER_UNE_CLE_SECRETE]
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[VOTRE_CLE_PUBLIQUE_STRIPE]
    NODE_ENV=development
    ```

-   **Backend (`./api/.env`)** :
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET=[GENERER_UNE_CLE_SECRETE_POUR_JWT]
    SUPERADMIN_EMAIL=admin@example.com
    SUPERADMIN_PASSWORD=supersecretpassword
    
    # Clés Stripe
    STRIPE_SECRET_KEY=[VOTRE_CLE_SECRETE_STRIPE]

    # Configuration du serveur mail (pour l'envoi d'e-mails)
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=user@example.com
    EMAIL_PASS=password
    EMAIL_FROM=noreply@example.com
    ADMIN_EMAIL=admin-contact@example.com # Email qui reçoit les messages du formulaire de contact

    # Clé API pour Genkit/Gemini
    GEMINI_API_KEY=[VOTRE_CLE_API_GEMINI]
    
    NODE_ENV=development
    ```

### 4. Initialisation de la Base de Données

Exécutez les migrations Prisma pour créer les tables et lancez le script de seeding pour créer le premier utilisateur super-administrateur.

```bash
cd api
npx prisma migrate dev --name init
npm run create-user
cd ..
```

### 5. Lancer les Serveurs en Développement

Vous devez lancer les deux serveurs simultanément dans des terminaux séparés.

-   **Pour le serveur Backend (API)** :
    ```bash
    cd api
    npm run dev
    ```
    Le serveur sera disponible à `http://localhost:3001`.

-   **Pour le serveur Frontend (Next.js)** :
    ```bash
    # Depuis la racine du projet
    npm run dev
    ```
    L'application sera disponible à `http://localhost:9003`.

### 6. Déploiement en Production

Pour le déploiement, vous devez builder les deux parties de l'application et les lancer avec un gestionnaire de processus comme PM2 pour le backend.

-   **Build du Backend** :
    ```bash
    cd api
    npm run build
    ```

-   **Build du Frontend** :
    ```bash
    # Depuis la racine du projet
    npm run build
    ```

-   **Lancer les serveurs en Production** :
    *   **Backend avec PM2** :
        ```bash
        cd api
        npm run start # Lance l'API avec PM2
        ```
    *   **Frontend avec Next.js** :
        ```bash
        # Depuis la racine du projet
        npm run start # Lance le serveur Next.js en production
        ```

N'oubliez pas de configurer votre serveur web (Nginx, Apache) pour rediriger les requêtes vers les bons ports.
```