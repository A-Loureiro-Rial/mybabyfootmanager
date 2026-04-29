# Changelog

All notable changes to this project will be documented in this file.

---

### 2026.04.29 / ALOUREI

### Added

- route pour lister les inscriptions d'équipes à un tournoi
- route pour désinscrire une équipe à un tournoi

### Updated

- route /register: param team -> teams, devient array of unsigned ints au lieu de unsigned int. Inscrit la liste d'équipe donnée au tournoi

---

### 2026.04.23 / ALOUREI

### Added

- user infos on auth / register
- route /me pour récupérer les infos utilisateurs depuis le token
- middleware pour
  - Checker les droits de l'utilisateur

### Fixed

- Adding try/catch everywhere it wasn't done yet
- Droits utilisateur stockés dans les tokens
- Cors management

---

### 2026.04.22 / ALOUREI

#### Added

- route pour
  - logout
  - rafraichir ses tokens
- middleware pour
  - checker que son refresh token est bon

#### Updated

- JWT : access token renvoyé et refresh token dans les cookies

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

#### Updated

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
