import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  styled,
  IconButton,
  Grid
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(26, 26, 26, 0.9)',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.common.white,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)',
  color: theme.palette.common.black,
  padding: '12px 32px',
  marginTop: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(212, 175, 55, 0.3)',
  }
}));

const ImagePreview = styled('img')({
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
  margin: '8px',
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    material: '',
    images: [],
    sustainability: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    // Créer des URLs pour la prévisualisation
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer un FormData pour envoyer les fichiers
      const productData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          productData.append(key, formData[key]);
        }
      });
      
      imageFiles.forEach(file => {
        productData.append('images', file);
      });

      await axios.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/products');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          mb: 4,
          fontFamily: 'Playfair Display',
          background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}
      >
        Ajouter un Produit
      </Typography>

      <StyledPaper>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Nom du produit"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Prix (DHS)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                select
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <MenuItem value="hauts">Hauts</MenuItem>
                <MenuItem value="bas">Bas</MenuItem>
                <MenuItem value="robes">Robes</MenuItem>
                <MenuItem value="accessoires">Accessoires</MenuItem>
              </StyledTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Matériau"
                name="material"
                value={formData.material}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Durabilité"
                name="sustainability"
                value={formData.sustainability}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.light',
                      }
                    }}
                  >
                    Ajouter des images
                  </Button>
                </label>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <ImagePreview src={image} alt={`Preview ${index}`} />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'error.main',
                        color: 'common.white',
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        }
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SubmitButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<AddIcon />}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
            </SubmitButton>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default AddProduct;
