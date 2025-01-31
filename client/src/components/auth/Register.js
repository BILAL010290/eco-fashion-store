import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { TextField, Button, Typography, Container, Box, Grid } from '@mui/material';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { firstName, lastName, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="auth-container">
      <Box className="auth-box">
        <Typography component="h1" variant="h4" className="auth-title">
          Créer un compte
        </Typography>
        {error && (
          <Typography color="error" align="center" className="error-message">
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Prénom"
                autoFocus
                value={firstName}
                onChange={onChange}
                className="auth-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Nom"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={onChange}
                className="auth-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                className="auth-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                className="auth-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password2"
                label="Confirmer le mot de passe"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
                className="auth-input"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="auth-button"
          >
            S'inscrire
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
