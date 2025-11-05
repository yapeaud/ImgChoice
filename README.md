# Projet MERN - Recherche d'Images avec OAuth

Application full-stack de recherche d'images utilisant la pile MERN (MongoDB, Express.js, React.js, Node.js) avec authentification OAuth.

## Fonctionnalités

- ✅ Authentification OAuth (Google, Facebook, GitHub) via Passport.js
- ✅ Recherche d'images via l'API Unsplash
- ✅ Bannière des 5 recherches les plus fréquentes
- ✅ Sélection multiple d'images avec compteur dynamique
- ✅ Historique de recherche personnel
- ✅ Interface moderne et responsive

## Structure du projet

```
/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ImageGrid.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── SearchHistory.jsx
│   │   │   └── TopSearchesBanner.jsx
|   |   ├── styles/
|   |   |   ├── Dashboard.css
│   │   │   ├── ImageGrid.css
│   │   │   ├── Login.css
│   │   │   ├── Navbar.css
│   │   │   ├── SearchForm.css
│   │   │   ├── SearchHistory.css
│   │   │   └── TopSearchesBanner.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/          # Backend Express
│   ├── config/
|   |   ├──imgchoice_db.js
│   │   └── passport.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── searchModel.js
│   ├── routes/
│   │   ├── authRoute.route.js
│   │   ├── searchRoute.route.js
│   │   ├── topSearches.js
│   │   └── history.js
│   ├── server.js
│   └── package.json
├── visual-proof/
└── README.md
```

## Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (installation locale ou MongoDB Atlas)
- Comptes développeur pour :
  - Google OAuth
  - Facebook OAuth
  - GitHub OAuth
  - Unsplash API

## Installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env` dans le dossier `server/` avec le contenu suivant :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/image-search
SESSION_SECRET=votre_secret_session_super_securise

# Google OAuth
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_APP_SECRET=votre_facebook_app_secret

# GitHub OAuth
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret

# Unsplash API
UNSPLASH_ACCESS_KEY=votre_unsplash_access_key
```

3. **Configurer OAuth**

### Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez l'API Google+
4. Créez des identifiants OAuth 2.0
5. Ajoutez `http://localhost:7070/api/auth/google/callback` comme URI de redirection

### Facebook OAuth
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez `http://localhost:7070/api/auth/facebook/callback` comme URI de redirection OAuth valide

### GitHub OAuth
1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Créez une nouvelle OAuth App
3. Ajoutez `http://localhost:7070/api/auth/github/callback` comme Authorization callback URL

### Unsplash API
1. Allez sur [Unsplash Developers](https://unsplash.com/developers)
2. Créez une nouvelle application
3. Copiez votre Access Key

## Démarrage

### Développement (client et serveur en parallèle)

```bash
npm run dev
```

### Séparément

**Backend :**
```bash
cd server
npm run dev
```

**Frontend :**
```bash
cd client
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:7070`
Le frontend React sera accessible sur `http://localhost:5175`

## APIs

### Authentification

- `GET /api/auth/google` - Connexion Google
- `GET /api/auth/facebook` - Connexion Facebook
- `GET /api/auth/github` - Connexion GitHub
- `GET /api/auth/user` - Récupérer l'utilisateur actuel
- `POST /api/auth/logout` - Déconnexion

### Recherche

- `POST /api/search` - Rechercher des images
  - Body: `{ term: "votre recherche" }`
  - Requiert authentification

### Recherches populaires

- `GET /api/top-searches` - Récupérer les 5 recherches les plus fréquentes

### Historique

- `GET /api/history` - Récupérer l'historique de recherche de l'utilisateur
  - Requiert authentification

## Technologies utilisées

### Backend
- **Express.js** - Framework web Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Passport.js** - Middleware d'authentification
- **Axios** - Client HTTP pour les appels API

### Frontend
- **React.js** - Bibliothèque UI
- **React Router** - Routage
- **Axios** - Client HTTP
- **CSS3** - Styling

## Notes importantes

- Assurez-vous que MongoDB est en cours d'exécution avant de démarrer le serveur
- Les cookies de session nécessitent que le frontend et le backend soient sur le même domaine en production
- Pour la production, configurez les variables d'environnement avec des valeurs sécurisées

## Licence

ISC