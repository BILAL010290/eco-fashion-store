# Eco Fashion Store

Une plateforme e-commerce moderne pour la mode durable et éthique.

## Fonctionnalités

- Catalogue de produits avec filtrage avancé
- Système d'authentification sécurisé
- Panier d'achat
- Passerelle de paiement sécurisée
- Système de revues et notations
- Liste de souhaits
- Suivi des commandes

## Technologies Utilisées

- Frontend: React.js, Material-UI, Redux
- Backend: Node.js, Express
- Base de données: MongoDB
- Paiement: Stripe
- Authentication: JWT

## Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installer les dépendances
```bash
# Installer les dépendances du serveur
cd server
npm install

# Installer les dépendances du client
cd ../client
npm install
```

3. Configurer les variables d'environnement
Créer un fichier .env à la racine du projet avec:
```
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
STRIPE_SECRET_KEY=votre_cle_stripe
```

## Lancement de l'Application

### Mode Développement

Pour lancer l'application en mode développement :

1. Démarrer le serveur backend
```bash
cd server
npm run server
```

2. Dans un autre terminal, démarrer le client frontend
```bash
cd client
npm start
```

### Configuration Requise

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- MongoDB (local ou instance cloud)

### Variables d'Environnement

Créez un fichier `.env` dans le dossier `server` avec les variables suivantes :
- `MONGODB_URI`: URL de connexion à votre base de données MongoDB
- `JWT_SECRET`: Clé secrète pour l'authentification
- `STRIPE_SECRET_KEY`: Clé secrète Stripe (optionnel)

### Accès à l'Application

- Frontend : `http://localhost:3000`
- Backend : `http://localhost:5000`

### Commandes Utiles

- `npm run dev` (dans le dossier `server`) : Démarre le serveur et le client simultanément
- `npm test` : Lancer les tests
- `npm run build` : Créer une version de production

## Structure du Projet

```
eco-fashion-store/
├── client/                 # Frontend React
├── server/                 # Backend Node.js
├── public/                 # Assets statiques
└── package.json           # Dépendances du projet
