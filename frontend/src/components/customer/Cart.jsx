import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { orderService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * Cart - shopping cart component for customers
 */
const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare items for checkout
      const checkoutItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const response = await orderService.checkout(checkoutItems);
      
      if (response.data.order) {
        // Clear cart after successful checkout
        clearCart();
        alert('Order placed successfully!');
        // Switch to orders tab
        navigate('/dashboard?tab=orders');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="cart-empty-icon">🛒</div>
        <h3 className="cart-empty-title">Your cart is empty</h3>
        <p className="cart-empty-text">Start shopping to add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product.id} className="cart-item">
              {item.product.image_url && (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.product.name}</h3>
                <p className="cart-item-price">
                  ${parseFloat(item.product.price).toFixed(2)} each
                </p>
              </div>

              <div className="cart-item-controls">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="cart-quantity-btn"
                >
                  −
                </button>
                
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                  className="cart-quantity-input"
                  min="1"
                  max={item.product.stock_quantity}
                />
                
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock_quantity}
                  className="cart-quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                <p className="cart-item-total-price">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="cart-remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">${getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="cart-checkout-btn"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>

          <p className="cart-checkout-note">
            * Payment simulation - order will be marked as paid automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;




