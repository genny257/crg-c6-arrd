# Plateforme de Gestion de la Croix-Rouge Gabonaise (Comité 6e Arr.)

Bienvenue sur la plateforme de gestion développée avec Firebase Studio. Cette application Next.js est conçue pour aider le comité du 6ème arrondissement de la Croix-Rouge Gabonaise à gérer ses volontaires, ses missions, ses dons et ses communications.

## Stack Technique

- **Framework Frontend**: [Next.js](https://nextjs.org/) (avec App Router)
- **Langage**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI**: [ShadCN/UI](https://ui.shadcn.com/)
- **Backend**: Serveur Node.js avec Express, Prisma et PostgreSQL.
- **IA & Logique Métier**: [Genkit (Firebase GenAI)](https://firebase.google.com/docs/genkit)
- **Authentification**: Gestion simple par contexte React (simulée).

---

## Prochaines Étapes pour le Déploiement

Voici les étapes clés restantes pour rendre la plateforme entièrement fonctionnelle et prête pour le déploiement.

### 1. Intégration complète de l'API Backend
- **Objectif**: Remplacer toutes les données statiques et la logique côté client par des appels à votre API backend.
- **Actions**:
  - **Missions, Dons, Blog, Rapports, Événements**: Connecter les pages du frontend aux endpoints de l'API pour lire, créer, modifier et supprimer des données.
  - **Volontaires**: Lier les actions (Approuver, Rejeter) aux endpoints de l'API pour mettre à jour les statuts.

### 2. Finaliser le Portail de Dons
- **Objectif**: Permettre des dons réels et automatisés.
- **Actions**:
  - **Intégration Paiement**: Connecter le formulaire de dons à une passerelle de paiement (côté backend).
  - **Génération de Reçus**: Créer un endpoint backend pour générer et envoyer des reçus de dons.

### 3. Intégrer les Fonctionnalités d'IA (Genkit)
- **Objectif**: Utiliser l'intelligence artificielle pour optimiser la gestion.
- **Actions**:
  - **Assignation Automatisée**: Créer un flux Genkit qui interroge votre API pour obtenir la liste des volontaires et suggère les meilleurs profils pour une mission.
  - **Aide à la Rédaction**: Utiliser Genkit pour aider à la création de contenu (articles, descriptions d'événements).

### 4. Carte Interactive
- **Objectif**: Offrir une visualisation géographique des opérations.
- **Actions**:
  - Remplacer l'image statique sur la page des missions par une carte dynamique (avec Leaflet ou OpenStreetMap) qui affiche les localisations des missions récupérées depuis votre API.

### 5. Finaliser l'Authentification
- **Objectif**: Sécuriser l'application avec un système d'authentification robuste.
- **Actions**:
  - Remplacer l'authentification simulée par un vrai système (par exemple, avec JWT) géré par votre backend.
