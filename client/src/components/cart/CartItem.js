import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  styled
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PriceDisplay from '../common/PriceDisplay';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  backgroundColor: 'rgba(26, 26, 26, 0.9)',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  }
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiIconButton-root': {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: 8,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.black,
    }
  }
}));

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <StyledCard sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, objectFit: 'cover' }}
        image={product.images[0]}
        alt={product.name}
      />
      <Box sx={{ display: 'flex', flexGrow: 1, p: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Playfair Display',
              color: 'primary.main',
              mb: 1
            }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PriceDisplay price={product.price} variant="small" />
            <Typography variant="body2" color="text.secondary">
              × {quantity}
            </Typography>
            <Box sx={{ ml: 'auto' }}>
              <PriceDisplay price={subtotal} variant="tag" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <QuantityControl>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(product._id, quantity + 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </QuantityControl>
            <IconButton
              onClick={() => onRemove(product._id)}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'common.white',
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default CartItem;
