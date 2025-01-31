import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Styles personnalisés
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  '& .MuiOutlinedInput-root': {
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.light,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light,
      }
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.light,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light,
      }
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
  }
}));

const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: 'all',
    sortBy: 'default'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        p: 3,
        borderRadius: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <StyledTextField
        name="search"
        label="Rechercher (nom, description, catégorie)"
        value={filters.search}
        onChange={handleChange}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ flex: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        name="minPrice"
        label="Prix minimum"
        type="number"
        value={filters.minPrice}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ width: 150 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">DHS</InputAdornment>,
        }}
      />

      <StyledTextField
        name="maxPrice"
        label="Prix maximum"
        type="number"
        value={filters.maxPrice}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ width: 150 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">DHS</InputAdornment>,
        }}
      />

      <StyledFormControl size="small">
        <InputLabel id="category-label" sx={{ color: 'primary.main' }}>
          Catégories
        </InputLabel>
        <Select
          labelId="category-label"
          name="category"
          value={filters.category}
          onChange={handleChange}
          label="Catégories"
        >
          <MenuItem value="all">Toutes les catégories</MenuItem>
          <MenuItem value="hauts">Hauts</MenuItem>
          <MenuItem value="bas">Bas</MenuItem>
          <MenuItem value="robes">Robes</MenuItem>
          <MenuItem value="accessoires">Accessoires</MenuItem>
        </Select>
      </StyledFormControl>

      <StyledFormControl size="small">
        <InputLabel id="sort-label" sx={{ color: 'primary.main' }}>
          Trier par
        </InputLabel>
        <Select
          labelId="sort-label"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          label="Trier par"
        >
          <MenuItem value="default">Défaut</MenuItem>
          <MenuItem value="priceAsc">Prix croissant</MenuItem>
          <MenuItem value="priceDesc">Prix décroissant</MenuItem>
          <MenuItem value="nameAsc">Nom A-Z</MenuItem>
          <MenuItem value="nameDesc">Nom Z-A</MenuItem>
        </Select>
      </StyledFormControl>
    </Box>
  );
};

export default ProductFilters;
