import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';
import PriceDisplay from '../common/PriceDisplay';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    // Validation des données avant paiement
    if (cart.items.length === 0) {
      // enqueueSnackbar('Votre panier est vide', { variant: 'warning' });
      return;
    }

    // Vérifier que tous les articles ont une taille
    const missingSize = cart.items.some(item => !item.size);
    if (missingSize) {
      // enqueueSnackbar('Veuillez sélectionner une taille pour tous les articles', { variant: 'warning' });
      return;
    }

    // Redirection vers la page de confirmation de commande
    navigate('/order-confirmation');
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <i className="fas fa-shopping-cart"></i>
        <h2>Votre panier est vide</h2>
        <p>Découvrez notre collection de vêtements durables</p>
        <button onClick={() => navigate('/products')} className="continue-shopping">
          Continuer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Mon Panier</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} />
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-size">Taille: {item.size}</p>
                <p className="item-price">{item.price.toFixed(2)} €</p>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="remove-item"
                >
                  <i className="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
              
              <div className="item-total">
                <PriceDisplay price={(item.price * item.quantity)} variant="tag" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Récapitulatif</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Sous-total</span>
              <span><PriceDisplay price={getCartTotal()} variant="tag" /></span>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span><PriceDisplay price={getCartTotal()} variant="large" /></span>
            </div>
          </div>
          
          <button 
            onClick={handleProceedToCheckout}
            className="checkout-button"
          >
            Procéder au paiement
          </button>
          
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
