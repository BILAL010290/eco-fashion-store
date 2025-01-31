import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/stripe-js';
import { useCart } from '../../context/CartContext';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getCartTotal, clearCart } = useCart();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Créer l'intention de paiement
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: getCartTotal()
        })
      });

      const data = await response.json();

      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: event.target.name.value,
              email: event.target.email.value
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError(null);
        clearCart();
        // Rediriger vers la page de confirmation
      }
    } catch (error) {
      setError('Une erreur est survenue lors du paiement.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label htmlFor="name">Nom complet</label>
        <input
          type="text"
          id="name"
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="card">Informations de carte</label>
        <div className="card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#9e2146'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="order-summary">
        <h3>Récapitulatif</h3>
        {cart.items.map(item => (
          <div key={`${item.id}-${item.size}`} className="order-item">
            <span>{item.name} (x{item.quantity})</span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total:</strong>
          <strong>{getCartTotal().toFixed(2)} €</strong>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="pay-button"
      >
        {processing ? 'Traitement...' : `Payer ${getCartTotal().toFixed(2)} €`}
      </button>

      {succeeded && (
        <div className="success-message">
          Paiement réussi ! Merci pour votre commande.
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
