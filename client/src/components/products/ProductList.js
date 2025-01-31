import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { products } from '../../data/products';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: 'all',
    sortBy: 'default'
  });

  useEffect(() => {
    // Flatten all products from different collections
    const flattenedProducts = [
      ...products.printemps,
      ...products.editionLimitee,
      ...products.accessoires
    ];
    
    console.log('Flattened Products:', flattenedProducts);
    
    setAllProducts(flattenedProducts);
    setFilteredProducts(flattenedProducts);
  }, []);

  const handleFilterChange = (newFilters) => {
    console.log('New Filters:', newFilters);
    setFilters(newFilters);
    
    let filtered = allProducts.filter(product => {
      console.log('Checking Product:', product);

      // Vérifications de sécurité pour éviter les erreurs undefined
      const name = product.name || '';
      const description = product.description || '';
      const category = product.category || '';
      const sustainability = product.sustainability || '';
      const price = product.price || 0;

      // Recherche plus flexible avec vérifications
      const matchesSearch = 
        !newFilters.search || 
        name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        description.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        category.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        sustainability.toLowerCase().includes(newFilters.search.toLowerCase());

      const matchesMinPrice = !newFilters.minPrice || price >= Number(newFilters.minPrice);
      const matchesMaxPrice = !newFilters.maxPrice || price <= Number(newFilters.maxPrice);
      const matchesCategory = newFilters.category === 'all' || category === newFilters.category;
      
      const isMatch = matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCategory;
      console.log('Product Match:', {
        name, 
        matchesSearch, 
        matchesMinPrice, 
        matchesMaxPrice, 
        matchesCategory, 
        isMatch
      });

      return isMatch;
    });

    console.log('Filtered Products:', filtered);

    // Tri des produits avec vérifications
    switch (newFilters.sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'nameAsc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        // Tri par défaut (garder l'ordre original)
        break;
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          mb: 4,
          fontFamily: 'Playfair Display',
          background: 'linear-gradient(45deg, #D4AF37 30%, #F4E5B2 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Nos Produits
      </Typography>

      <Box sx={{ mb: 4 }}>
        <ProductFilters onFilterChange={handleFilterChange} />
      </Box>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Aucun produit ne correspond à vos critères
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;
