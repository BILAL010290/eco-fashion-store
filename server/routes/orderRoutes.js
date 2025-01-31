const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Créer une nouvelle commande
router.post('/create', async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    // Vérifier la disponibilité des produits
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }
      // Ici, vous pourriez ajouter une logique de vérification de stock
    }

    const newOrder = new Order({
      products: products.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      totalPrice: totalPrice,
      status: 'En cours de traitement'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Erreur lors de la création de la commande', error);
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
});

// Récupérer les commandes d'un utilisateur
router.get('/user', async (req, res) => {
  try {
    const userId = req.user._id; // Supposant que l'authentification middleware a défini req.user
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});

// Récupérer une commande spécifique
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('products.productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

module.exports = router;
