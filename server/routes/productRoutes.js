const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Rating = require('../models/Rating');

// Obtenir la note moyenne d'un produit
router.get('/:productId/rating', async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(`Requête de récupération de note pour le produit : ${productId}`);
    
    const ratings = await Rating.find({ productId });
    console.log(`Notes trouvées pour le produit ${productId} :`, ratings);

    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length 
      : 0;

    console.log(`Note moyenne pour le produit ${productId} : ${averageRating}`);

    res.json({ 
      averageRating: Number(averageRating.toFixed(1)), 
      totalRatings: ratings.length 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la note', {
      productId: req.params.productId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de la note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ajouter une note à un produit
router.post('/:productId/rate', async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, userName, userEmail } = req.body;

    console.log(`Requête de notation pour le produit : ${productId}`, { 
      rating, 
      userName, 
      userEmail 
    });

    // Validation de base
    if (!rating || rating < 1 || rating > 5) {
      console.warn(`Note invalide pour le produit ${productId} : ${rating}`);
      return res.status(400).json({ message: 'Note invalide. Doit être entre 1 et 5.' });
    }

    // Vérifier les notations récentes pour ce produit et cette adresse email
    const recentRatings = await Rating.find({ 
      productId, 
      userEmail,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 heures
    });

    console.log(`Notes récentes pour le produit ${productId} et l'email ${userEmail} :`, recentRatings);

    if (recentRatings.length >= 3) {
      console.warn(`Trop de notations récentes pour le produit ${productId} et l'email ${userEmail}`);
      return res.status(429).json({ 
        message: 'Trop de notations récentes. Attendez 24 heures avant de noter à nouveau.' 
      });
    }

    // Créer une nouvelle note
    const newRating = new Rating({
      productId,
      value: rating,
      userName: userName || 'Utilisateur Anonyme',
      userEmail: userEmail || null
    });

    await newRating.save();
    console.log(`Note enregistrée pour le produit ${productId} :`, newRating);

    // Récupérer toutes les notes du produit
    const ratings = await Rating.find({ productId });
    const averageRating = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    console.log(`Nouvelle note moyenne pour le produit ${productId} : ${averageRating}`);

    res.json({ 
      averageRating: Number(averageRating.toFixed(1)), 
      totalRatings: ratings.length 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note', {
      productId: req.params.productId,
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'ajout de la note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
