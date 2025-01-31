import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from '../../utils/axios';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const orderData = {
          products: cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            price: item.price
          })),
          totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
          status: 'En cours de traitement'
        };

        const response = await axios.post('/api/orders/create', orderData);
        setOrderDetails(response.data);
        setActiveStep(1);
        clearCart();
      } catch (error) {
        console.error('Erreur lors de la création de la commande', error);
        setActiveStep(2);
      }
    };

    if (cart.length > 0) {
      createOrder();
    }
  }, [cart, clearCart]);

  const handleReturnToShopping = () => {
    navigate('/products');
  };

  const steps = ['Validation du panier', 'Commande confirmée', 'Erreur de paiement'];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #D4AF37'
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                sx={{
                  '& .MuiStepLabel-label': { 
                    color: activeStep === steps.indexOf(label) ? '#D4AF37' : 'white' 
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <CheckCircleIcon sx={{ fontSize: 100, color: '#D4AF37', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#D4AF37' }}>
              Commande Confirmée !
            </Typography>
            <Typography variant="body1" paragraph>
              Votre commande a été traitée avec succès.
            </Typography>

            {orderDetails && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#D4AF37' }}>
                  Détails de la Commande
                </Typography>
                <Divider sx={{ my: 2, backgroundColor: '#D4AF37' }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Numéro de Commande</Typography>
                    <Typography variant="body2">{orderDetails._id}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="body2">
                      {orderDetails.totalPrice.toFixed(2)} DHS
                    </Typography>
                  </Grid>
                </Grid>

                <List sx={{ mt: 2 }}>
                  {orderDetails.products.map((product, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={product.name}
                        secondary={`Quantité: ${product.quantity} | Taille: ${product.size}`}
                      />
                      <Typography variant="body2">
                        {(product.price * product.quantity).toFixed(2)} DHS
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Button 
              variant="contained" 
              onClick={handleReturnToShopping}
              sx={{ 
                mt: 3, 
                backgroundColor: '#D4AF37', 
                color: 'black',
                '&:hover': { 
                  backgroundColor: '#F4E5B2' 
                }
              }}
            >
              Continuer mes achats
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'red' }}>
              Erreur de Paiement
            </Typography>
            <Typography variant="body1" paragraph>
              Un problème est survenu lors du traitement de votre commande.
              Veuillez réessayer ou contacter le support.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleReturnToShopping}
              sx={{ 
                mt: 3, 
                backgroundColor: 'red', 
                color: 'white',
                '&:hover': { 
                  backgroundColor: '#FF6B6B' 
                }
              }}
            >
              Retour aux produits
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;
