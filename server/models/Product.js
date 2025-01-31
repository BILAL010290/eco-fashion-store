const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['hauts', 'bas', 'robes', 'accessoires']
  },
  material: {
    type: String,
    required: true
  },
  sustainability: [{
    type: String,
    enum: ['GOTS', 'Fair Trade', 'OEKO-TEX', 'Recyclé']
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    name: String,
    hexCode: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
