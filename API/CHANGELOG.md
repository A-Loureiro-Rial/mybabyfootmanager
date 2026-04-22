# Changelog

All notable changes to this project will be documented in this file.

---

### 2026.04.22 / ALOUREI

### Updated

- JWT : stockage dans les cookies au lieu du header

---

### 2026.04.21 / ALOUREI

TLDR: API fonctionnelle

#### Added

- Authentication
- JWT
- Controlleurs:
  - MatchesController
  - TournamentsController
  - UsersController
- Middleware:
  - authMiddleware

### Updated

- Tous les modèles afin d'utiliser complètement Sequelize
- Teamcontroller afin d'utliser Sequelize

---

### 2026.04.20 / ALOUREI

TLDR: routes fonctionnelles pour CRUD teams

#### Added

- Sequelize
- Architecture MVC
- Modèles pour :
  - matches
  - registrations
  - teams
  - tournaments
  - users
- Controlleur:
  - TeamsController
- Routes pour :
  - Ajouter une team
  - Modifier une team
  - Lister les teams
  - Supprimer une team

---

### 2026.04.19 / ALOUREI

#### Added

- Dockerfile
- Connexion à MySQL
