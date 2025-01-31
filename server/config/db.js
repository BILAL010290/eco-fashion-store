const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);

    // Configuration détaillée de Mongoose
    mongoose.set('debug', true);
    mongoose.set('strictQuery', false);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout court pour détecter rapidement les problèmes
      socketTimeoutMS: 45000, // Timeout de socket
      family: 4 // Forcer IPv4
    });

    console.log('✅ MongoDB connecté avec succès');
    
    // Événements de connexion
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connecté à la base de données');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Erreur de connexion Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Connexion Mongoose interrompue');
    });

  } catch (err) {
    console.error('❌ Échec de connexion à MongoDB:', err);
    
    // Log détaillé de l'erreur
    console.error({
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });

    // Tentative de reconnexion après un délai
    setTimeout(() => {
      console.log('Tentative de reconnexion...');
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
