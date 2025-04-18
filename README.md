# 🎬 MERN Movies App

Une application complète MERN (MongoDB, Express, React, Node.js) pour la gestion de films, d’utilisateurs, de commentaires, et d’acteurs.

---

## 🚀 Lancer le projet

### ✅ Prérequis

- [Docker](https://www.docker.com/) & Docker Compose installés

### ▶️ Démarrage

```bash
docker compose up
```

Cela va lancer :
- Le backend Express
- La base MongoDB
- Le frontend React (si configuré dans le Dockerfile)

---

## 🗂 Structure du projet

```
MERN_MOVIES_APP/
│
├── backend/                # Serveur Express (API)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/               # Frontend React
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── common/
│       │   ├── layout/
│       │   └── movies/
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── MovieDetailsPage.js
│       │   └── WishlistPage.js
│       ├── services/
│       │   └── api.js
│       └── App.js
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🌐 API – Backend

### 👤 Utilisateurs

| Méthode | URL                        | Description                               |
|--------:|----------------------------|-------------------------------------------|
| POST    | `/api/register`            | Créer un compte                           |
| POST    | `/api/login`               | Connexion utilisateur                     |
| GET     | `/api/getuser/:id`         | Infos utilisateur                         |
| PUT     | `/api/updateuser/:id`      | Modifier un utilisateur                   |
| DELETE  | `/api/deleteuser/:id`      | Supprimer un utilisateur                  |
| GET     | `/api/getallusers`         | Lister tous les utilisateurs              |

---

### 🎬 Films

| Méthode | URL                       | Description                                       |
|--------:|---------------------------|---------------------------------------------------|
| GET     | `/api/`                   | Tous les films (avec pagination)                 |
| GET     | `/api/filter`             | Recherche combinée par titre et genre            |
| GET     | `/api/search/:title`      | Rechercher des films par titre                   |
| GET     | `/api/genre/:name`        | Films par genre                                  |
| GET     | `/api/:id`                | Détails d’un film par ID                         |
| POST    | `/api/comments/:id`       | Ajouter un commentaire à un film (token requis)  |

---

### 🎭 Acteurs

| Méthode | URL                         | Description                               |
|--------:|-----------------------------|-------------------------------------------|
| GET     | `/api/`                     | Tous les acteurs                          |
| GET     | `/api/search/:name`         | Recherche d’acteurs par nom               |
| GET     | `/api/:id/movies`           | Tous les films d’un acteur                |
| GET     | `/api/:id`                  | Détails d’un acteur                       |


---

## 🖥 Frontend – React

### Pages principales
- `HomePage.js` → Affichage de tous les films
- `MovieDetailsPage.js` → Détails d’un film + commentaires
- `WishlistPage.js` → Liste de souhaits
- `components/` → Découpage modulaire : auth, layout, movies, etc.
- `services/api.js` → Contient les appels vers l’API backend

---

## 🔐 Authentification

- Authentification via JWT
- Header requis pour les routes protégées :
```
Authorization: Bearer <votre_token>
```

---

## ⚙️ Exemple `.env` (backend)

```env
PORT=5000
MONGO_URI=mongodb://db:27017/mydatabase
```

---

## ✅ Fonctionnalités clés

- Authentification sécurisée
- CRUD utilisateur
- Notation et commentaires sur les films
- Recherche par titre, genre, acteur
- Pagination
- Watchlist
- Architecture MERN moderne

