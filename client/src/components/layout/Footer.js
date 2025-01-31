import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import './Footer.css';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#D4AF37', // Or élégant
  background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)', // Dégradé or
  color: '#000000', // Texte noir
  padding: theme.spacing(4, 0),
  boxShadow: '0 -2px 4px rgba(0,0,0,0.1)', // Ombre subtile en haut
}));

const Logo = styled('img')(({ theme }) => ({
  height: 100, // Ajustez la hauteur selon vos préférences
  marginBottom: theme.spacing(2),
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  color: '#000000',
  '& h3, & h4': {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    color: '#4A4A4A', // Gris royal élégant
    borderBottom: '2px solid #4A4A4A', // Ligne de soulignement
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
  '& a, & p': {
    color: '#000000', // Texte en noir
    textDecoration: 'none',
    display: 'block',
    marginBottom: theme.spacing(1),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const NewsletterButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4A4A4A', // Gris royal
  color: '#D4AF37', // Or élégant
  marginLeft: theme.spacing(1),
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#3A3A3A', // Gris royal plus foncé au survol
    color: '#F4E5B2', // Nuance or clair au survol
  },
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap' 
          }}
        >
          <FooterSection sx={{ flex: 1, mr: 2 }}>
            <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Logo 
                src="/logo.png" 
                alt="Eco Fashion Store Logo" 
              />
            </Link>
            <Typography variant="body1">
              Votre destination shopping en ligne
            </Typography>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Link to="#" style={{ color: '#000000', marginRight: '16px' }}>Facebook</Link>
              <Link to="#" style={{ color: '#000000', marginRight: '16px' }}>Instagram</Link>
              <Link to="#" style={{ color: '#000000' }}>Twitter</Link>
            </Box>
          </FooterSection>

          <FooterSection sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h4">Navigation</Typography>
            <Link to="/" style={{ color: '#000000' }}>Accueil</Link>
            <Link to="/products" style={{ color: '#000000' }}>Produits</Link>
            <Link to="/cart" style={{ color: '#000000' }}>Panier</Link>
          </FooterSection>

          <FooterSection sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h4">Service Client</Typography>
            <Link to="/contact" style={{ color: '#000000' }}>Contact</Link>
            <Link to="/shipping" style={{ color: '#000000' }}>Livraison</Link>
            <Link to="/returns" style={{ color: '#000000' }}>Retours</Link>
          </FooterSection>

          <FooterSection sx={{ flex: 1 }}>
            <Typography variant="h4">Newsletter</Typography>
            <Typography variant="body1">
              Restez informé de nos dernières offres
            </Typography>
            <Box sx={{ display: 'flex', mt: 2, width: '100%' }}>
              <input 
                type="email" 
                placeholder="Votre email" 
                style={{ 
                  flex: 1,
                  padding: '8px', 
                  border: '1px solid rgba(0,0,0,0.2)', 
                  backgroundColor: 'rgba(255,255,255,0.2)' 
                }} 
              />
              <NewsletterButton variant="contained">
                S'inscrire
              </NewsletterButton>
            </Box>
          </FooterSection>
        </Box>

        <Box 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(0,0,0,0.1)', 
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2" sx={{ color: '#000000' }}>
            &copy; 2025 Click & Buy. Tous droits réservés.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link to="/privacy" style={{ color: '#000000', marginRight: '16px' }}>
              Confidentialité
            </Link>
            <Link to="/terms" style={{ color: '#000000' }}>
              Conditions d'utilisation
            </Link>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
