# Routes de la Plateforme

Ce document liste l'ensemble des routes et des endpoints de l'application, séparés entre le frontend (Next.js) et le backend (API Express).

---

## 1. Routes du Frontend (Next.js)

Ces routes correspondent aux pages visibles par les utilisateurs dans leur navigateur. Elles sont définies par la structure des dossiers dans `/src/app`.

### Pages Publiques

-   `/` : Page d'accueil.
-   `/login` : Page de connexion pour les administrateurs et volontaires.
-   `/register` : Formulaire d'inscription pour les nouveaux volontaires.
-   `/donations` : Page pour faire un don.
-   `/contact` : Page de contact avec formulaire.
-   `/team` : Page de présentation de l'équipe et des volontaires actifs.
-   `/principes` : Page décrivant les 7 principes de la Croix-Rouge.
-   `/hymne` : Page avec les paroles et l'audio de l'hymne.

#### Routes "Média"
-   `/blog` : Liste des articles de blog.
-   `/blog/[slug]` : Page de détail d'un article de blog.
-   `/events` : Liste des événements publics.
-   `/reports` : Liste des rapports publics téléchargeables.
-   `/missions/[id]` : Page publique de détail d'une mission, avec le formulaire d'inscription pour les volontaires.

### Pages du Tableau de Bord (Dashboard)

Ces routes sont protégées et nécessitent une authentification.

-   `/dashboard` : Page d'accueil du tableau de bord avec les statistiques clés.
-   `/dashboard/profile` : Page où l'utilisateur connecté peut voir et modifier son profil.
-   `/dashboard/missions` : Liste des missions pour la gestion.
-   `/dashboard/missions/new` : Formulaire de création d'une nouvelle mission.
-   `/dashboard/missions/[id]` : Page de détail d'une mission (vue admin).
-   `/dashboard/missions/[id]/edit` : Formulaire d'édition d'une mission.
-   `/dashboard/volunteers` : Liste des volontaires avec filtres et options de gestion.
-   `/dashboard/volunteers/[id]` : Page de détail d'un volontaire (vue admin).
-   `/dashboard/team` : Page de gestion de l'équipe et de l'organigramme.
-   `/dashboard/donations` : Historique et gestion des dons.
-   `/dashboard/analytics` : Page de statistiques avancées.
-   `/dashboard/calendar` : Calendrier des missions et événements.
-   `/dashboard/archive` : Système de gestion de fichiers et d'archives.
-   `/dashboard/blog` : Vue de gestion des articles de blog (créer/modifier/supprimer).
-   `/dashboard/blog/new` : Formulaire de création d'un article.
-   `/dashboard/blog/[id]/edit` : Formulaire d'édition d'un article.
-   `/dashboard/events/new` : Formulaire de création d'un événement.
-   `/dashboard/events/[id]/edit` : Formulaire d'édition d'un événement.
-   `/dashboard/reports` : Vue de gestion des rapports (créer/modifier/supprimer).
-   `/dashboard/reports/new` : Formulaire de création d'un rapport.
-   `/dashboard/reports/[id]/edit` : Formulaire d'édition d'un rapport.

---

## 2. Endpoints de l'API Backend (Express)

Ces endpoints sont appelés par le frontend pour interagir avec la base de données. Ils sont définis dans `/api/src/routes`.

### Missions (`/api/missions`)
-   `GET /api/missions` : Récupère la liste de toutes les missions.
-   `POST /api/missions` : Crée une nouvelle mission.
-   `GET /api/missions/:id` : Récupère une mission par son ID.
-   `PUT /api/missions/:id` : Met à jour une mission.
-   `DELETE /api/missions/:id` : Supprime une mission.

### Volontaires (`/api/volunteers`)
-   `GET /api/volunteers` : Récupère la liste de tous les volontaires.
-   `POST /api/volunteers` : Crée un nouveau profil de volontaire.
-   `GET /api/volunteers/:id` : Récupère un volontaire par son ID.
-   `PUT /api/volunteers/:id` : Met à jour un volontaire.
-   `PATCH /api/volunteers/:id/status` : Met à jour le statut d'un volontaire.
-   `DELETE /api/volunteers/:id` : Supprime un volontaire.

### Blog (`/api/blog`)
-   `GET /api/blog` : Récupère tous les articles.
-   `GET /api/blog/slug/:slug` : Récupère un article par son slug.
-   `POST /api/blog` : Crée un nouvel article.
-   `GET /api/blog/:id` : Récupère un article par son ID.
-   `PUT /api/blog/:id` : Met à jour un article.
-   `DELETE /api/blog/:id` : Supprime un article.

### Événements (`/api/events`)
-   `GET /api/events` : Récupère tous les événements.
-   `POST /api/events` : Crée un nouvel événement.
-   `GET /api/events/:id` : Récupère un événement par son ID.
-   `PUT /api/events/:id` : Met à jour un événement.
-   `DELETE /api/events/:id` : Supprime un événement.

### Authentification & Inscription
-   `POST /api/register` : Crée un nouvel utilisateur (compte de connexion).
-   `POST /api/auth/signin` : Connecte un utilisateur (géré par NextAuth).
