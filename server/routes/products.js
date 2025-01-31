const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées'));
  }
});

// @route   GET api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { name, minPrice, maxPrice, category } = req.query;
    
    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    console.log('Product Details:', {
      id: product._id,
      name: product.name,
      images: product.images,
      price: product.price
    });

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    res.status(500).json({ 
      message: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? err.message : null 
    });
  }
});

// @route   POST api/products
// @desc    Create a new product
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      sustainabilityScore 
    } = req.body;

    // Validation de base
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis', 
        details: {
          name: !!name,
          description: !!description,
          price: !!price,
          category: !!category
        }
      });
    }

    // Vérifier si un fichier image a été téléchargé
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    // Créer un nouveau produit
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      sustainabilityScore: parseFloat(sustainabilityScore) || 0,
      image: imagePath
    });

    // Enregistrer le produit
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: savedProduct
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    
    res.status(500).json({ 
      message: 'Erreur serveur lors de la création du produit',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Verify product owner
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Traitement des nouvelles images
    let images = product.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      images = [...images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
        price: parseFloat(req.body.price)
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Verify product owner
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Supprimer les images associées
    product.images.forEach(image => {
      const imagePath = path.join(__dirname, '..', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await product.remove();
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/products/:id/comments
// @desc    Add a comment to a product
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const { content, rating } = req.body;
    const comment = new Comment({
      content,
      rating,
      user: req.user.id,
      product: req.params.id
    });

    await comment.save();
    
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/products/:id/comments
// @desc    Get comments for a specific product
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    console.log('Comments for product:', {
      productId: req.params.id,
      commentCount: comments.length
    });

    res.json(comments);
  } catch (err) {
    console.error('Error fetching product comments:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    res.status(500).json({ 
      message: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? err.message : null 
    });
  }
});

module.exports = router;
