# Guide de Gestion des Utilisateurs Administrateurs

Ce document explique comment utiliser le script de "seeding" pour créer des utilisateurs `ADMIN` et `SUPERADMIN` pour votre application. C'est un outil essentiel pour la maintenance, surtout après un déploiement initial en production sur une base de données vide.

**IMPORTANT :** N'exécutez ces commandes que si vous savez ce que vous faites. Elles modifient directement la base de données.

---

## Scénario 1 : Créer le tout premier Super Administrateur

Ce scénario est à utiliser lors du premier déploiement en production.

### Étape 1 : Configurer les variables d'environnement

1.  Créez un fichier `.env.local` à la racine de votre projet s'il n'existe pas.
2.  Assurez-vous que ce fichier contient les informations de votre super administrateur par défaut. Remplacez les valeurs d'exemple par des informations sécurisées.

    ```dotenv
    # ... autres variables ...

    # Informations pour le premier super administrateur (utilisé par le script de seeding)
    SUPERADMIN_EMAIL="votre-email-securise@domaine.com"
    SUPERADMIN_PASSWORD="un-mot-de-passe-tres-solide"
    ```

### Étape 2 : Lancer le script

Exécutez la commande suivante dans votre terminal. Le script lira les informations du fichier `.env.local` et créera le compte.

```bash
npm run prisma:seed
```

Le script confirmera la création de l'utilisateur. Vous pourrez alors vous connecter avec ces identifiants.

---

## Scénario 2 : Créer un nouvel Administrateur (ou un autre Super Administrateur)

Utilisez cette méthode à tout moment pour ajouter de nouveaux comptes administrateurs sans avoir à modifier le fichier `.env.local`.

### Étape 1 : Préparer la commande

Vous allez passer les informations de l'utilisateur (email, mot de passe, rôle) directement dans la commande. Le rôle doit être `ADMIN` ou `SUPERADMIN`.

### Étape 2 : Lancer le script avec des arguments

Exécutez la commande suivante en remplaçant les valeurs d'exemple. **Notez bien le `--` après `npm run prisma:seed`**, il est essentiel pour que les arguments soient passés au script.

**Exemple pour créer un compte `ADMIN` :**

```bash
npm run prisma:seed -- --email nouvel.admin@domaine.com --password autre-pass-solide --role ADMIN
```

**Exemple pour créer un autre `SUPERADMIN` :**

```bash
npm run prisma:seed -- --email autre.superadmin@domaine.com --password encore-un-pass --role SUPERADMIN
```

Le script confirmera la création de l'utilisateur avec le rôle spécifié.

---

### Notes de sécurité

-   Utilisez toujours des mots de passe forts et uniques.
-   Le fichier `.env.local` ne doit **jamais** être partagé ou versionné dans Git. Assurez-vous qu'il est bien présent dans votre fichier `.gitignore`.
-   Limitez le nombre de comptes `SUPERADMIN`.
