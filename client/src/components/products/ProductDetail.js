import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import './ProductDetail.css';
import PriceDisplay from '../common/PriceDisplay';
import { useCart } from '../../context/CartContext';
import { Button, Box, Typography, Rating, TextField, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: '' });
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductAndComments = async () => {
      try {
        const [productRes, commentsRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/products/${id}/comments`)
        ]);
        
        console.log('Fetched Product:', productRes.data);
        console.log('Fetched Comments:', commentsRes.data);
        
        // Ensure product has default values
        const fetchedProduct = {
          ...productRes.data,
          images: productRes.data.images || [],
          name: productRes.data.name || 'Produit sans nom',
          description: productRes.data.description || 'Aucune description disponible',
          price: productRes.data.price || 0,
          category: productRes.data.category || 'Non catégorisé',
          material: productRes.data.material || 'Matériau non spécifié'
        };
        
        setProduct(fetchedProduct);
        
        // Ensure comments is an array
        const fetchedComments = Array.isArray(commentsRes.data) 
          ? commentsRes.data 
          : [];
        
        setComments(fetchedComments);
        
        // Check if current user is the product owner
        const token = localStorage.getItem('token');
        if (token) {
          const userRes = await axios.get('/api/auth/me', {
            headers: { 'x-auth-token': token }
          });
          setIsOwner(userRes.data._id === productRes.data.user);
        }
      } catch (err) {
        console.error('Error fetching product or comments:', err);
        setError('Erreur lors du chargement du produit ou des commentaires');
      }
    };

    fetchProductAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`/api/products/${id}/comments`, {
        content: newComment.content,
        rating: rating,
        // Ajouter un nom générique si pas de nom
        userName: user?.firstName || 'Utilisateur'
      });

      // Mettre à jour les commentaires
      setComments([response.data, ...comments]);
      
      // Réinitialiser le formulaire
      setNewComment({ content: '' });
      setRating(0);

      // Notification toast
      toast.success('Commentaire ajouté avec succès !', {
        position: "bottom-right",
        autoClose: 3000,
        style: {
          backgroundColor: '#D4AF37',
          color: 'black'
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
      toast.error('Erreur lors de l\'ajout du commentaire', {
        position: "bottom-right",
        autoClose: 3000,
        style: {
          backgroundColor: '#FF6B6B',
          color: 'white'
        }
      });
    }
  };

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { 'x-auth-token': token }
      });
      navigate('/products');
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    
    if (product) {
      addToCart(product, quantity, selectedSize);
    }
  };

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div>Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-images">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - ${index + 1}`}
                className="product-detail-image"
                onError={(e) => {
                  e.target.src = '/path/to/default/image.jpg'; // Ajoutez un chemin vers une image par défaut
                }}
              />
            ))
          ) : (
            <div className="no-images">Aucune image disponible</div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="product-details">
            <p>Prix : <PriceDisplay price={product.price} /></p>
            <p>Catégorie : {product.category}</p>
            <p>Matériau : {product.material}</p>
          </div>

          <Box sx={{ mt: 4, p: 2, backgroundColor: '#F9F5E7', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Avis et Commentaires
            </Typography>
            
            {/* Liste des commentaires existants */}
            <Box sx={{ mb: 3 }}>
              {comments.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  Aucun commentaire pour ce produit
                </Typography>
              ) : (
                comments.map((comment, index) => (
                  <Box 
                    key={comment._id || index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      p: 2, 
                      backgroundColor: 'white', 
                      borderRadius: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        backgroundColor: '#D4AF37', 
                        color: 'black' 
                      }}
                    >
                      {comment.user?.firstName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{comment.content}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating 
                          value={comment.rating} 
                          readOnly 
                          precision={0.5}
                          icon={<StarIcon sx={{ color: '#D4AF37' }} />}
                          emptyIcon={<StarIcon sx={{ color: '#E0E0E0' }} />}
                        />
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ ml: 2 }}
                        >
                          Par {comment.user?.firstName || 'Utilisateur'} 
                          le {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {/* Formulaire d'ajout de commentaire */}
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Votre commentaire"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                required
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#D4AF37',
                    },
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Votre note :
                </Typography>
                <Rating
                  value={rating}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  icon={<StarIcon sx={{ color: '#D4AF37' }} />}
                  emptyIcon={<StarIcon sx={{ color: '#E0E0E0' }} />}
                />
                {rating !== null && (
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                    {rating} / 5
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  backgroundColor: '#D4AF37', 
                  color: 'black',
                  '&:hover': { 
                    backgroundColor: '#F4E5B2' 
                  }
                }}
              >
                Envoyer mon commentaire
              </Button>
            </form>
          </Box>

          {product && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Sélectionnez une taille :</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSize(size)}
                    sx={{ 
                      borderColor: selectedSize === size ? 'primary.main' : 'grey.500',
                      color: selectedSize === size ? 'white' : 'black'
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Typography>{quantity}</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </Box>

              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                sx={{ 
                  backgroundColor: '#D4AF37', 
                  color: 'black',
                  '&:hover': { 
                    backgroundColor: '#F4E5B2' 
                  } 
                }}
              >
                Ajouter au panier
              </Button>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
