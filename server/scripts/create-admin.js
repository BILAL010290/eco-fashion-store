const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

async function createAdminUser() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Supprimer tous les utilisateurs admin existants
    await User.deleteMany({ role: 'admin' });

    // Créer un nouvel utilisateur admin
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'admin@ecofashion.com',
      password: 'AdminPassword123!', // Le middleware va hasher automatiquement
      role: 'admin'
    });

    // Sauvegarder l'utilisateur admin
    await adminUser.save();

    console.log('Administrateur créé avec succès :');
    console.log('Email:', adminUser.email);
    console.log('Mot de passe:', 'AdminPassword123!');

    // Fermer la connexion
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    mongoose.connection.close();
  }
}

createAdminUser();
