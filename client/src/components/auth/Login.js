import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  CssBaseline, 
  Avatar 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔑 Login: Attempting login with:', { email: formData.email, password: formData.password });

    try {
      const response = await axios.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔑 Login: Successful login', { 
        token: 'Token received', 
        user: response.data.user 
      });

      // Vérifier la structure de la réponse
      console.log('🔍 Full Response:', response.data);

      // Stocker le token
      if (!response.data.token) {
        throw new Error('Aucun token reçu du serveur');
      }

      // Stockage sécurisé du token
      localStorage.setItem('token', response.data.token);
      console.log('🔒 Login: Token stored in localStorage', {
        tokenLength: response.data.token.length,
        localStorageKeys: Object.keys(localStorage)
      });

      // Dispatch d'événements personnalisés
      const tokenEvent = new CustomEvent('token-received', { 
        detail: { token: response.data.token } 
      });
      window.dispatchEvent(tokenEvent);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('force-token-check'));

      // Redirection
      navigate('/');
    } catch (error) {
      console.error('🚫 Login Error DETAILS:', {
        fullError: error,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        errorMessage: error.message,
        networkError: error.response === undefined
      });

      // Afficher un message d'erreur plus informatif
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        const errorMessage = error.response.data.message || 
                             error.response.data.details || 
                             'Erreur de connexion du serveur';
        
        setError(errorMessage);
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        setError('Pas de réponse du serveur. Vérifiez votre connexion.');
      } else {
        // Quelque chose s\'est mal passé lors de la configuration de la requête
        setError(error.message || 'Erreur inattendue');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Se Connecter
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
