import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';

/**
 * OrderHistory - displays customer's order history
 */
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);
      loadOrders(); // Reload orders after cancellation
      alert('Order cancelled successfully');
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'status-badge status-paid';
      case 'pending':
        return 'status-badge status-pending';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge status-default';
    }
  };

  if (loading) {
    return <div className="loading-message">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="order-empty-icon">📦</div>
        <h3 className="order-empty-title">No orders yet</h3>
        <p className="order-empty-text">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="order-header-content">
              <div className="order-info">
                <h3 className="order-number">
                  Order #{order.id}
                </h3>
                <p className="order-date">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="order-actions">
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="cancel-order-btn"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="order-content">
            <h4 className="order-items-title">Order Items</h4>
            <div className="order-items">
              {order.order_items?.map((item) => (
                <div key={item.id} className="order-item">
                  {item.product?.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="order-item-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="order-item-info">
                    <p className="order-item-name">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="order-item-details">
                      Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="order-item-subtotal">
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="order-total-row">
                <span className="order-total-label">Total</span>
                <span className="order-total-amount">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;




