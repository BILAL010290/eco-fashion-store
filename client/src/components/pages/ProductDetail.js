import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="product-detail">
      <h2>Détails du produit</h2>
      <div className="product-content">
        <div className="product-image">
          <img src="/placeholder.jpg" alt="Product" />
        </div>
        <div className="product-info">
          <h3>Nom du produit</h3>
          <p className="price">29.99 €</p>
          <p className="description">Description du produit...</p>
          <button className="add-to-cart">Ajouter au panier</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
