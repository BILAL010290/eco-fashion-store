import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hauts',
    material: '',
    sustainability: [],
    stock: '',
    sizes: [],
    colors: [],
    images: []
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  // Vérification de l'authentification et du rôle admin
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log(' AddProduct: Token check', {
        token: token ? 'Token exists' : 'No token'
      });

      if (!token) {
        console.log(' AddProduct: No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        
        console.log(' AddProduct: Authentication successful', {
          user: res.data,
          userRole: res.data.role
        });
        
        setIsAuthenticated(true);
        
        // Vérification du rôle admin
        if (res.data.role !== 'admin') {
          console.log(' AddProduct: User is not an admin');
          navigate('/products');
          return;
        }
        
        setIsAdmin(true);
      } catch (err) {
        console.error(' AddProduct: Authentication failed', {
          error: err.response?.data || err.message,
          status: err.response?.status
        });
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input Change:', { name, value });
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions).map(option => option.value);
    console.log('Multi-Select Change:', { name, values });
    setProductData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Image Files:', files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(' Submitting Product:', { productData, imageFiles });
    
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        const value = productData[key];
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Append images
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log(' No token, redirecting to login');
        navigate('/login');
        return;
      }

      console.log(' Sending product data to server');
      const response = await axios.post('/api/products', formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(' Product added successfully:', response.data);
      // Rediriger vers la page de détail du produit
      navigate(`/products/${response.data._id}`);
    } catch (error) {
      console.error(' Error adding product', error);
      setErrors({
        submit: error.response?.data?.message || 'Erreur lors de l\'ajout du produit'
      });
    }
  };

  // Si l'utilisateur n'est pas un admin, ne rien afficher
  if (!isAuthenticated || !isAdmin) {
    console.log(' Not authenticated or not admin, showing nothing');
    return null;
  }

  return (
    <div className="add-product-container">
      <h1>Ajouter un nouveau produit</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Nom du produit</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="hauts">Hauts</option>
            <option value="bas">Bas</option>
            <option value="robes">Robes</option>
            <option value="accessoires">Accessoires</option>
          </select>
        </div>

        <div className="form-group">
          <label>Matériau</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Durabilité</label>
          <select
            name="sustainability"
            multiple
            value={productData.sustainability}
            onChange={handleMultiSelectChange}
          >
            <option value="GOTS">GOTS</option>
            <option value="Fair Trade">Fair Trade</option>
            <option value="OEKO-TEX">OEKO-TEX</option>
            <option value="Recyclé">Recyclé</option>
          </select>
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Tailles disponibles</label>
          <select
            name="sizes"
            multiple
            value={productData.sizes}
            onChange={handleMultiSelectChange}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Images du produit</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Vous pouvez sélectionner plusieurs images</small>
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <button type="submit" className="submit-button">
          Ajouter le produit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
