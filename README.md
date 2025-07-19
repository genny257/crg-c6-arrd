# Plateforme de Gestion de la Croix-Rouge Gabonaise (Comité 6e Arr.)

Bienvenue sur la plateforme de gestion développée avec Firebase Studio. Cette application Next.js est conçue pour aider le comité du 6ème arrondissement de la Croix-Rouge Gabonaise à gérer ses volontaires, ses missions, ses dons et ses communications.

## Stack Technique

- **Framework**: [Next.js](https://nextjs.org/) (avec App Router)
- **Langage**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI**: [ShadCN/UI](https://ui.shadcn.com/)
- **Base de données**: [Firestore](https://firebase.google.com/docs/firestore)
- **IA & Logique Métier**: [Genkit (Firebase GenAI)](https://firebase.google.com/docs/genkit)
- **Authentification**: Gestion simple par contexte React (simulée)

---

## Prochaines Étapes pour le Déploiement

Voici les étapes clés restantes pour rendre la plateforme entièrement fonctionnelle et prête pour le déploiement.

### 1. Connecter la Base de Données (Firestore)
- [x] **Volontaires**: Lier les actions (Approuver, Rejeter) pour mettre à jour les statuts dans Firestore.
- [ ] **Missions, Dons, Blog, Rapports, Événements**: Remplacer les données statiques par des appels à Firestore pour lire et écrire les informations.

### 2. Implémenter le CRUD Complet
- [ ] **Formulaires de Création/Modification**: Créer les interfaces pour ajouter et éditer des missions, articles, événements, etc., et les connecter à Firestore.
- [ ] **Gestion des Fichiers**: Implémenter l'upload de fichiers (images, rapports PDF) vers Firebase Storage.

### 3. Intégrer les Fonctionnalités d'IA (Genkit)
- [ ] **Assignation Automatisée**: Créer un flux Genkit pour suggérer des volontaires pour une mission en fonction de leurs compétences et disponibilités.
- [ ] **Aide à la Rédaction**: Utiliser l'IA pour aider à la création de contenu (articles, descriptions d'événements).

### 4. Finaliser le Portail de Dons
- [ ] **Intégration Paiement**: Connecter le formulaire de dons à une passerelle de paiement.
- [ ] **Génération de Reçus**: Créer un flux pour générer et envoyer des reçus de dons.

### 5. Carte Interactive
- [ ] **Remplacer l'image statique** sur la page des missions par une carte dynamique affichant les emplacements des missions depuis Firestore.
