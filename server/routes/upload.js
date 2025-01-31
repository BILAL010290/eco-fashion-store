const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

// @route   POST api/upload/product
// @desc    Upload product image
// @access  Private
router.post('/product', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image n\'a été téléchargée' });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement des images' });
  }
});

// @route   DELETE api/upload/product/:filename
// @desc    Delete product image
// @access  Private
router.delete('/product/:filename', auth, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../uploads/products', req.params.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'image' });
      }
      res.json({ message: 'Image supprimée avec succès' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
