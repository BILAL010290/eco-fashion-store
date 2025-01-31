import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { formatPrice } from '../../utils/formatters';

const PriceContainer = styled(Box)(({ theme, variant }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)', 
    color: '#000000', 
    fontFamily: 'Playfair Display, serif',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)', 
    
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)', 
    },

    '& .price-text': {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#000000', 
    },

    '& .currency': {
      fontSize: '0.8em',
      fontWeight: 'normal',
      opacity: 0.7,
    }
  };

  const variants = {
    tag: {
      padding: '8px 16px',
      borderRadius: theme.shape.borderRadius,
      fontSize: '1.1rem',
      '@media (max-width: 600px)': {
        fontSize: '1rem',
        padding: '6px 12px',
      }
    },
    large: {
      padding: '16px 32px',
      borderRadius: theme.shape.borderRadius * 1.5,
      fontSize: '1.5rem',
      '@media (max-width: 600px)': {
        fontSize: '1.25rem',
        padding: '12px 24px',
      }
    },
    small: {
      padding: '4px 8px',
      borderRadius: theme.shape.borderRadius / 2,
      fontSize: '0.9rem',
      '@media (max-width: 600px)': {
        fontSize: '0.8rem',
        padding: '3px 6px',
      }
    },
    text: {
      background: 'none',
      padding: '0',
      color: theme.palette.primary.main,
      fontSize: '1.1rem',
      fontWeight: 600,
      boxShadow: 'none',
      '@media (max-width: 600px)': {
        fontSize: '1rem',
      },
      '&:hover': {
        transform: 'none',
      }
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

const formatPriceWithCurrency = (price) => {
  const formattedPrice = formatPrice(price);
  const [amount, currency] = formattedPrice.split(' ');
  return { amount, currency };
};

const PriceDisplay = ({ 
  price, 
  variant = 'tag',
  className,
  ...props 
}) => {
  const { amount, currency } = formatPriceWithCurrency(price);
  
  return (
    <PriceContainer variant={variant} className={className} {...props}>
      <Typography 
        variant="body1" 
        className={`price-text black-price ${className}`}
      >
        {amount} <span className="currency">{currency}</span>
      </Typography>
    </PriceContainer>
  );
};

export default PriceDisplay;
