const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuration CORS pour autoriser les requêtes du frontend
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'https://eco-fashion-store.netlify.app', 
    'https://click-and-buy.netlify.app',
    /^https:\/\/.*-eco-fashion-store\.netlify\.app$/,
    /^https:\/\/click-and-buy-.*\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logs de requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques du client
const clientPath = path.join(__dirname, '../client/build');
app.use(express.static(clientPath));

// Route de base
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Routes de base pour tester
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur backend opérationnel' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
