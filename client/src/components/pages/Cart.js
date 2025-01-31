import React from 'react';

const Cart = () => {
  return (
    <div className="cart">
      <h2>Votre Panier</h2>
      <div className="cart-items">
        <div className="cart-item">
          <img src="/placeholder.jpg" alt="Product" />
          <div className="item-details">
            <h3>Nom du produit</h3>
            <p className="price">29.99 €</p>
            <div className="quantity">
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
          </div>
        </div>
      </div>
      <div className="cart-summary">
        <h3>Total: 29.99 €</h3>
        <button className="checkout-button">Passer la commande</button>
      </div>
    </div>
  );
};

export default Cart;
