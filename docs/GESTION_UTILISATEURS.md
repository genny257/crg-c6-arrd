# Gestion des Utilisateurs

Ce document explique comment utiliser le script de gestion des utilisateurs pour créer de nouveaux administrateurs pour la plateforme.

## Rôles Disponibles

Il existe deux types de rôles que vous pouvez assigner :

-   `SUPERADMIN` : A tous les droits sur la plateforme.
-   `ADMIN` : A des droits limités (gestion des missions, des articles, etc.).

## Prérequis

-   Avoir accès à l'environnement de développement ou de production.
-   Le service de l'API doit être configuré avec la base de données.

## Comment créer un utilisateur

Pour créer un nouvel utilisateur, vous utiliserez une commande `npm` dans le répertoire `api` du projet. La commande nécessite trois arguments :

-   `--email` : L'adresse e-mail du nouvel utilisateur.
-   `--password` : Le mot de passe du nouvel utilisateur.
-   `--role` : Le rôle à assigner (`SUPERADMIN` ou `ADMIN`).

### Procédure

1.  Ouvrez un terminal et naviguez jusqu'au répertoire `api` :
    ```bash
    cd /path/to/your/project/api
    ```

2.  Exécutez la commande `npm run create-user` en fournissant les arguments. Notez l'utilisation de `--` après `create-user` pour passer les arguments directement au script.

    **Exemple pour créer un ADMIN :**
    ```bash
    npm run create-user -- --email nouvel.admin@example.com --password "motdepassesecurise123" --role ADMIN
    ```

    **Exemple pour créer un SUPERADMIN :**
    ```bash
    npm run create-user -- --email super.admin@example.com --password "motdepassesupersecret" --role SUPERADMIN
    ```

3.  Le script confirmera la création de l'utilisateur ou affichera une erreur si l'utilisateur existe déjà ou si les informations sont incorrectes.

### Création par défaut

Si vous exécutez `npm run create-user` sans arguments, le script tentera de créer un utilisateur `SUPERADMIN` en utilisant les informations définies dans le fichier `.env` de l'API (`SUPERADMIN_EMAIL` et `SUPERADMIN_PASSWORD`).
