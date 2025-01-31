import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useCart } from '../../context/CartContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Container,
  styled,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import './Navbar.css';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#D4AF37', // Or élégant
  background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)', // Dégradé or
  color: '#000000', // Texte noir
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Ombre subtile
}));

const Logo = styled('img')(({ theme }) => ({
  height: 100, // Ajustez la hauteur selon vos préférences
  marginRight: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: '#000000', // Texte noir
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Léger fond sombre au survol
  },
}));

const AddProductButton = styled(StyledButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: '#000000', // Texte noir
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)' // Léger fond sombre au survol
  }
}));

const CartIconButton = styled(IconButton)(({ theme }) => ({
  color: '#000000',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  }
}));

const CartSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
}));

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { cart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculer le nombre total d'articles dans le panier
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      console.log(' Token Check', { tokenExists: !!token });

      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          console.log(' Token Verified', { user: response.data });

          setIsAuthenticated(true);
          setUser(response.data);
        } catch (error) {
          console.error(' Token Verification Failed', {
            errorMessage: error.message,
            status: error.response?.status
          });

          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    checkTokenValidity();

    const handleTokenEvents = () => {
      checkTokenValidity();
    };

    window.addEventListener('token-received', handleTokenEvents);
    window.addEventListener('force-token-check', handleTokenEvents);

    return () => {
      window.removeEventListener('token-received', handleTokenEvents);
      window.removeEventListener('force-token-check', handleTokenEvents);
    };
  }, []);

  const handleLogout = () => {
    console.log(' Logout initiated');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <StyledAppBar position="static" className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Logo src="/logo.png" alt="Eco Fashion Store Logo" />
          </Link>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <StyledButton component={Link} to="/">
              Accueil
            </StyledButton>
            <StyledButton component={Link} to="/products">
              Produits
            </StyledButton>
            <AddProductButton 
              component={Link} 
              to="/products/add-simple"
            >
              Ajouter un Produit
            </AddProductButton>
            <CartIconButton 
              component={Link} 
              to="/cart"
              sx={{ color: 'black' }}
            >
              <Badge 
                badgeContent={cartItemCount} 
                color="primary" 
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#D4AF37', // Or élégant
                    color: 'black',
                    fontWeight: 'bold'
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </CartIconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isAuthenticated ? (
              <>
                <StyledButton component={Link} to="/login">
                  Connexion
                </StyledButton>
                <StyledButton component={Link} to="/register">
                  S'inscrire
                </StyledButton>
              </>
            ) : (
              <>
                <StyledButton component={Link} to="/profile">
                  Mon Profil
                </StyledButton>
                <StyledButton 
                  onClick={handleLogout}
                  color="secondary"
                  variant="outlined"
                >
                  Déconnexion
                </StyledButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
