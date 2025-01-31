import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  styled
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PriceDisplay from '../common/PriceDisplay';
import { useCart } from '../../context/CartContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: 'rgba(26, 26, 26, 0.9)',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
    '& .product-image': {
      transform: 'scale(1.05)',
    },
    '& .overlay': {
      opacity: 1,
    }
  }
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  paddingTop: '125%', // 4:5 aspect ratio
  overflow: 'hidden',
  '& .product-image': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  '& .overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)',
  color: theme.palette.common.black,
  padding: '8px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
  }
}));

const ProductCard = ({ product }) => {
  const { _id, name, price, images, sustainability, description, sizes } = product;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [rating, setRating] = useState(product.averageRating || 0);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    // Initialiser la note du produit au chargement
    const fetchProductRating = async () => {
      // Validation de l'ID du produit
      if (!_id) {
        console.warn('ID du produit manquant, impossible de récupérer la note');
        return;
      }

      try {
        console.log(`Tentative de récupération de la note pour le produit : ${_id}`);
        const response = await axios.get(`/api/products/${_id}/rating`);
        console.log('Réponse de la récupération de note :', response.data);
        setRating(response.data.averageRating || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération de la note', {
          error: error.message,
          response: error.response,
          request: error.request
        });
      }
    };

    fetchProductRating();
  }, [_id]);

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, 1, selectedSize);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    // Validation de l'ID du produit
    if (!_id) {
      toast.error('Impossible de noter ce produit. ID manquant.', {
        position: "bottom-right",
        autoClose: 3000,
        style: {
          backgroundColor: '#FF6B6B',
          color: 'white'
        }
      });
      return;
    }

    try {
      console.log(`Tentative de notation du produit : ${_id} avec la note ${newValue}`);
      const response = await axios.post(`/api/products/${_id}/rate`, {
        rating: newValue,
        userName: 'Utilisateur Anonyme',
        userEmail: null // Optionnel, peut être remplacé par un email si disponible
      });

      console.log('Réponse de la notation :', response.data);

      // Mettre à jour la note moyenne
      setRating(response.data.averageRating);

      toast.success('Note ajoutée avec succès !', {
        position: "bottom-right",
        autoClose: 3000,
        style: {
          backgroundColor: '#D4AF37',
          color: 'black'
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note', {
        error: error.message,
        response: error.response,
        request: error.request
      });
      
      // Gestion des erreurs spécifiques
      if (error.response && error.response.status === 429) {
        toast.error('Trop de notations récentes. Attendez 24 heures.', {
          position: "bottom-right",
          autoClose: 3000,
          style: {
            backgroundColor: '#FF6B6B',
            color: 'white'
          }
        });
      } else {
        toast.error('Impossible d\'ajouter la note. Vérifiez votre connexion.', {
          position: "bottom-right",
          autoClose: 3000,
          style: {
            backgroundColor: '#FF6B6B',
            color: 'white'
          }
        });
      }
    }
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <PriceDisplay price={price} variant="tag" />
      </Box>
      <ImageWrapper>
        <CardMedia
          component="img"
          image={images[0]}
          alt={name}
          className="product-image"
        />
        <Box className="overlay" />
      </ImageWrapper>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 'bold', color: '#D4AF37' }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Rating
            value={rating}
            precision={0.5}
            onChange={handleRatingChange}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            icon={<StarIcon sx={{ color: '#D4AF37' }} />}
            emptyIcon={<StarIcon sx={{ color: '#E0E0E0' }} />}
          />
          <Typography variant="body2" color="textSecondary">
            {rating.toFixed(1)} / 5
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedSize(size)}
              sx={{
                backgroundColor: selectedSize === size ? '#D4AF37' : 'transparent',
                color: selectedSize === size ? 'black' : '#D4AF37',
                '&:hover': {
                  backgroundColor: selectedSize === size ? '#F4E5B2' : 'transparent',
                }
              }}
            >
              {size}
            </Button>
          ))}
        </Box>
        <StyledButton 
          fullWidth 
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          Ajouter au panier
        </StyledButton>
        <Box sx={{ mt: 'auto' }}>
          <Link to={`/product/${_id}`} style={{ textDecoration: 'none' }}>
            <StyledButton fullWidth>
              Voir détails
            </StyledButton>
          </Link>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;
