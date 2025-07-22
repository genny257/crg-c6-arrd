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

Ces endpoints sont appelés par le frontend pour interagir avec la base de données. Ils sont définis dans `/api/src/routes`. Le préfixe de base pour toutes les routes de l'API est `/api`.

### Authentification (gérée par Next.js)
-   `POST /api/register` : Crée un nouvel utilisateur (compte de connexion).
-   `POST /api/auth/signin` : Connecte un utilisateur (géré par NextAuth).

### Missions (`/missions`)
-   `GET /missions` : Récupère la liste de toutes les missions.
-   `POST /missions` : Crée une nouvelle mission.
-   `GET /missions/:id` : Récupère une mission par son ID.
-   `PUT /missions/:id` : Met à jour une mission.
-   `DELETE /missions/:id` : Supprime une mission.

### Volontaires (`/volunteers`)
-   `GET /volunteers` : Récupère la liste de tous les volontaires.
-   `POST /volunteers` : Crée un nouveau profil de volontaire (après l'inscription).
-   `GET /volunteers/:id` : Récupère un volontaire par son ID.
-   `PUT /volunteers/:id` : Met à jour les informations d'un volontaire.
-   `DELETE /volunteers/:id` : Supprime un volontaire.

### Blog (`/blog`)
-   `GET /blog` : Récupère tous les articles.
-   `POST /blog` : Crée un nouvel article.
-   `GET /blog/slug/:slug` : Récupère un article par son slug.
-   `GET /blog/:id` : Récupère un article par son ID.
-   `PUT /blog/:id` : Met à jour un article.
-   `DELETE /blog/:id` : Supprime un article.

### Événements (`/events`)
-   `GET /events` : Récupère tous les événements.
-   `POST /events` : Crée un nouvel événement.
-   `GET /events/:id` : Récupère un événement par son ID.
-   `PUT /events/:id` : Met à jour un événement.
-   `DELETE /events/:id` : Supprime un événement.

### Rapports (`/reports`)
-   `GET /reports` : Récupère tous les rapports.
-   `POST /reports` : Crée un nouveau rapport.
-   `GET /reports/:id` : Récupère un rapport par son ID.
-   `PUT /reports/:id` : Met à jour un rapport.
-   `DELETE /reports/:id` : Supprime un rapport.
