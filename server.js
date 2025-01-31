const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configuration CORS plus permissive
app.use(cors({
  origin: ['http://localhost:3000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  
  // Capture the original end and json methods
  const originalEnd = res.end;
  const originalJson = res.json;

  // Override the end method to log response
  res.end = function(chunk, encoding) {
    console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode}`);
    originalEnd.call(this, chunk, encoding);
  };

  // Override the json method to log response
  res.json = function(body) {
    console.log(`[${new Date().toISOString()}] JSON Response:`, body);
    originalJson.call(this, body);
  };

  next();
});

// Routes
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/products', require('./server/routes/products'));
app.use('/api/payment', require('./server/routes/payment'));
app.use('/api/upload', require('./server/routes/upload'));

// Basic routes
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Serveur ECO Fashion Store en ligne',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Configuration des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'client', 'public', 'images')));
app.use(express.static(path.join(__dirname, 'client', 'public')));

// En développement
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'public')));
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  // Proxy API requests to the React development server
  app.use('/api', createProxyMiddleware({ 
    target: 'http://localhost:3000',
    changeOrigin: true 
  }));

  // Proxy WebSocket connections for hot reloading
  app.use('/sockjs-node', createProxyMiddleware({ 
    target: 'http://localhost:3000',
    ws: true,
    changeOrigin: true 
  }));
}

// En production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // In development, redirect to React dev server
  app.get('*', (req, res) => {
    res.redirect('http://localhost:3000');
  });
}

// Fallback route
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route non trouvée', 
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Une erreur est survenue', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne' 
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';  // Écoute sur toutes les interfaces réseau

function startServer(port) {
  server.listen(port, HOST, () => {
    console.log(` Serveur démarré sur http://${HOST}:${port}`);
    console.log(`Environnement: ${process.env.NODE_ENV}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
