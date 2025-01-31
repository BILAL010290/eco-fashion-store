import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from '../../utils/axios';

const AddProductSimple = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sustainabilityScore: ''
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Produit ajouté avec succès', response.data);
      
      // Réinitialiser le formulaire
      setProductData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sustainabilityScore: ''
      });
      setImage(null);
      
      // Optionnel : afficher un message de succès
      alert('Produit ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          mt: 4 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ajouter un Nouveau Produit
        </Typography>

        <TextField
          name="name"
          label="Nom du Produit"
          value={productData.name}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          name="description"
          label="Description"
          value={productData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          name="price"
          label="Prix"
          type="number"
          value={productData.price}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />

        <FormControl fullWidth>
          <InputLabel>Catégorie</InputLabel>
          <Select
            name="category"
            value={productData.category}
            label="Catégorie"
            onChange={handleChange}
            required
          >
            <MenuItem value="vetements">Vêtements</MenuItem>
            <MenuItem value="accessoires">Accessoires</MenuItem>
            <MenuItem value="chaussures">Chaussures</MenuItem>
            <MenuItem value="autre">Autre</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="stock"
          label="Stock"
          type="number"
          value={productData.stock}
          onChange={handleChange}
          fullWidth
          InputProps={{ inputProps: { min: 0 } }}
        />

        <TextField
          name="sustainabilityScore"
          label="Score de Durabilité"
          type="number"
          value={productData.sustainabilityScore}
          onChange={handleChange}
          fullWidth
          InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
        />

        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Télécharger une Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {image && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Image sélectionnée : {image.name}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Ajouter le Produit
        </Button>
      </Box>
    </Container>
  );
};

export default AddProductSimple;
