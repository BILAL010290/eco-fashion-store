import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    material: '',
    sustainability: [],
    images: []
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, description, price, category, material } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };

      await axios.post('/api/products', formData, config);
      navigate('/products');
    } catch (err) {
      setError(err.response.data.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-box">
        <h2>Ajouter un produit</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom du produit"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              name="description"
              value={description}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Prix"
              name="price"
              value={price}
              onChange={onChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <select name="category" value={category} onChange={onChange} required>
              <option value="">Sélectionner une catégorie</option>
              <option value="hauts">Hauts</option>
              <option value="bas">Bas</option>
              <option value="robes">Robes</option>
              <option value="accessoires">Accessoires</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Matériau"
              name="material"
              value={material}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => {
                // Handle image upload logic here
                // You might want to use FormData to upload images
              }}
            />
          </div>
          <button type="submit" className="submit-button">
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
