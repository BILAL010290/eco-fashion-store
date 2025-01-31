const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware de logging spécifique à l'authentification
router.use((req, res, next) => {
  console.log(' Auth Middleware:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// @route   POST api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password,
      adminKey // Nouveau champ pour créer un admin
    } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Clé secrète pour créer un admin
    const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY || 'SUPER_SECRET_ADMIN_KEY';

    user = new User({
      firstName,
      lastName,
      email,
      password,
      role: adminKey === ADMIN_CREATION_KEY ? 'admin' : 'user'
    });

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
});

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log(' Login Attempt:', {
      email: req.body.email,
      passwordProvided: !!req.body.password
    });

    const { email, password } = req.body;

    // Validation des données d'entrée
    if (!email || !password) {
      console.log(' Login Failed: Missing email or password');
      return res.status(400).json({ 
        message: 'Email et mot de passe requis',
        details: {
          email: !!email,
          password: !!password
        }
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(` Login Failed: No user found with email ${email}`);
      return res.status(400).json({ 
        message: 'Identifiants invalides',
        details: 'Utilisateur non trouvé'
      });
    }

    // Vérification du mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log(` Login Failed: Password mismatch for user ${email}`);
      return res.status(400).json({ 
        message: 'Identifiants invalides',
        details: 'Mot de passe incorrect'
      });
    }

    // Génération du token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log(` Login Successful: User ${email} authenticated`);

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(' Login Error:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      message: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
});

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    console.log(' Token Verification Request', {
      userId: req.user._id
    });

    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé',
        details: 'Aucun utilisateur correspondant au token'
      });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error(' Token Verification Error', {
      message: error.message
    });

    res.status(500).json({ 
      message: 'Erreur serveur lors de la vérification du token'
    });
  }
});

module.exports = router;
