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
-   **PWA**: L'application est une Progressive Web App et peut être installée sur les appareils mobiles pour un accès hors ligne.

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
    # !! IMPORTANT !! Générez une clé secrète forte avec `openssl rand -base64 32`
    NEXTAUTH_SECRET=[GENERER_UNE_CLE_SECRETE]
    NODE_ENV=development
    ```

-   **Backend (`./api/.env`)** :
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    
    # !! TRÈS IMPORTANT !! Générez une clé secrète forte pour les JWT
    # Utilisez par exemple `openssl rand -base64 32` dans votre terminal
    JWT_SECRET=[GENERER_UNE_CLE_SECRETE_POUR_JWT]

    # Utilisateur Super-administrateur par défaut (créé via `npm run create-user`)
    SUPERADMIN_EMAIL=admin@example.com
    SUPERADMIN_PASSWORD=supersecretpassword
    
    # Configuration du serveur mail (pour l'envoi d'e-mails)
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=user@example.com
    EMAIL_PASS=password
    EMAIL_FROM="Nom Expéditeur <noreply@example.com>"
    ADMIN_EMAIL=admin-contact@example.com # Email qui reçoit les messages du formulaire de contact

    # Clé API pour Genkit/Gemini
    GEMINI_API_KEY=[VOTRE_CLE_API_GEMINI]
    
    # Configuration API Airtel Money
    AIRTEL_API_BASE_URL=https://openapiuat.airtel.africa
    AIRTEL_API_CLIENT_ID=votre_client_id
    AIRTEL_API_CLIENT_SECRET=votre_client_secret
    AIRTEL_API_COUNTRY=GA # Code pays ISO 3166-1 alpha-2 (ex: GA pour Gabon)
    AIRTEL_API_CURRENCY=XAF # Code devise ISO 4217 (ex: XAF)
    AIRTEL_API_PUBLIC_KEY="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArUj2SQKLCdTqJ3/ZL6nkh1N3rtjXBBM+0hBUrhJ/VNSMTBixpD+JjeNaHbONcrvJGSstC2tcVfD04s9xGIKr9TT6hCYaqGojLeuLimVdXzaP5DzDyrHY8mYgHL+/EGRDh+/7B56Gw8UZxOBPtF6Wjjq0TWGcw5YOW1lSPUeaD+kupmDFlMRk26fASELwkYo5NkHgL/w+XzXw8gDZtrNS6L8UX2mfqdQ9qKpdMP3ztfOUPjmTvIbTKrGLx0U2sUSQINtMxZQzsYaXIGoZ2thvbIhJMDFBNbznuv1n8b03Q3MAnEK/xCduQBUkUg1syy7jZMT4ETDeFuW2NMZhteaadwIDAQAB"

    NODE_ENV=development
    ```

### 4. Initialisation de la Base de Données

Exécutez les migrations Prisma pour créer les tables et lancez le script de seeding pour créer le premier utilisateur super-administrateur.

```bash
cd api
npx prisma migrate dev --name init
# Crée le superadmin par défaut à partir du .env
npm run create-user 
cd ..
```
Pour créer d'autres utilisateurs, consultez `docs/GESTION_UTILISATEURS.md`.

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
        npm start # Lance le serveur Next.js en production
        ```

N'oubliez pas de configurer votre serveur web (Nginx, Apache) pour rediriger les requêtes vers les bons ports.

---

## 🚀 Intégration d'Airtel Money

Pour automatiser la réception des dons, la plateforme est intégrée avec l'API **Airtel Money Collections**.

### Flux de Paiement (USSD Push)

Le flux de paiement implémenté est le **USSD Push**, qui offre une expérience utilisateur sécurisée et fluide :

1.  **Initiation** : Le donateur remplit le formulaire de don sur le site (montant, nom, e-mail, numéro de téléphone).
2.  **Requête API** : Notre backend appelle l'endpoint `POST /merchant/v2/payments/` d'Airtel Money pour initier la transaction. À ce stade, le don est enregistré dans notre base de données avec le statut `PENDING`.
3.  **Validation Utilisateur** : Le donateur reçoit une notification push sur son téléphone lui demandant de valider la transaction en saisissant son code PIN Airtel Money. L'application ne gère **jamais** le code PIN de l'utilisateur.
4.  **Callback (Notification)** : Une fois la transaction validée (ou échouée), Airtel Money envoie une notification (webhook) à notre endpoint `POST /api/donations/callback`.
5.  **Confirmation Automatique** : Notre backend reçoit ce callback, vérifie les informations, et met automatiquement à jour le statut de la donation dans la base de données vers `CONFIRMED` ou `FAILED`.

### Guide des Fonctionnalités de l'API Airtel Money

Voici un résumé des différentes sections de l'API Airtel Money pour mieux comprendre leur rôle.

#### ✅ **Parties Essentielles pour les Dons**

| Objectif                          | Sections API Concernées                        |
| --------------------------------- | ---------------------------------------------- |
| **Authentification**              | `Authorization`, `Encryption`                  |
| **Réception de Paiement**         | `Collection-APIs` (utilisé), `Cash-In APIs`    |
| **Notification de Paiement Reçu** | `Notification API` (mécanisme de callback)     |
| **Suivi des Transactions**        | `Transactions-Summary-APIs`                    |
| **Consultation du Solde**         | `Account`                                      |
| **Documentation & Aide**          | `Getting Started`, `Error Codes`, `References` |

---

### 📘 **Détail des APIs Disponibles (pour référence)**

#### 1. APIs de Gestion de Prêts
*   **Loan Lifecycle Management** : Gère le cycle de vie complet d’un prêt.
*   **Overdraft Loans** : API pour octroyer des crédits de découvert.
*   **Term Loans** : API pour proposer des prêts à terme planifiés.
*   **Loan User KYC** : Gère les vérifications d'identité (KYC) pour les bénéficiaires de prêts.

#### 2. APIs de Notification et de Facturation
*   **Notification API** : Essentiel pour recevoir des notifications automatiques (webhooks) sur les événements.
*   **Billers Callback** : Gère les retours de statut pour les paiements de factures.
*   **TopUp Notification** : Notifications spécifiques aux recharges (top-up).

#### 3. APIs de Transaction (Paiement & Transfert)
*   **Collection-APIs** : **(Utilisé pour les dons)** Permet de recevoir des paiements depuis les utilisateurs Airtel vers votre compte via USSD Push.
*   **Cash-In APIs** : Alternative pour recevoir des paiements (nécessite la gestion du PIN).
*   **Disbursement-APIs / IOP Disbursement** : Envoi d’argent depuis votre compte vers un ou plusieurs utilisateurs (payout).
*   **Bank to Wallet** : Permet de transférer de l’argent d’un compte bancaire vers un portefeuille Airtel.
*   **Cash-Out APIs** : Permet à un utilisateur de retirer de l’argent vers une banque ou un distributeur.
*   **ATM Withdrawal API** : Permet un retrait depuis un distributeur sans carte.
*   **Remittance APIs / Remittance APIs-V2** : Pour les transferts d’argent entre pays.

#### 4. APIs de Compte et de Conformité
*   **Authorization** : **(Essentiel)** Détaille comment s’authentifier (via token OAuth2).
*   **Encryption** : **(Essentiel)** Définit comment chiffrer les données sensibles.
*   **KYC** : Vérification d’identité standard pour la conformité.
*   **Account** : Fournit des informations sur le compte Airtel (solde, statut, etc.).
*   **Transactions-Summary-APIs** : Fournit un résumé des transactions sur une période donnée.

#### 5. APIs de Services Annexes
*   **Getting Started** : Documentation de démarrage pour les développeurs.
*   **Error Codes** : Liste des codes d’erreur renvoyés par les APIs.
*   **Buy Airtime** : API pour acheter du crédit téléphonique.
*   **Favourite Service** : Permet de configurer des services favoris pour un utilisateur.
*   **References** : Documents de référence (schémas JSON, spécifications, etc.).
```