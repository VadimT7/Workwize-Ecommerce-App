/**
 * PurchaseHistory - displays purchase history for supplier's products
 */
const PurchaseHistory = ({ purchases }) => {
  if (purchases.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="purchase-empty-icon">💰</div>
        <h3 className="purchase-empty-title">No purchases yet</h3>
        <p className="purchase-empty-text">Your sales will appear here.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = purchases.reduce((sum, purchase) => sum + parseFloat(purchase.subtotal), 0);

  return (
    <div>
      <div className="purchase-stats-card">
        <div className="purchase-stats-grid">
          <div className="purchase-stat">
            <p className="purchase-stat-label">Total Sales</p>
            <p className="purchase-stat-value">
              {purchases.length}
            </p>
          </div>
          <div className="purchase-stat">
            <p className="purchase-stat-label">Total Revenue</p>
            <p className="purchase-stat-value purchase-stat-revenue">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="purchase-stat">
            <p className="purchase-stat-label">Average Order Value</p>
            <p className="purchase-stat-value">
              ${purchases.length > 0 ? (totalRevenue / purchases.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="purchase-table-container">
        <div className="purchase-table-header">
          <h3 className="purchase-table-title">
            Recent Purchases
          </h3>
        </div>
        <div className="purchase-table-wrapper">
          <table className="purchase-table">
            <thead className="purchase-table-head">
              <tr>
                <th className="purchase-table-th">Date</th>
                <th className="purchase-table-th">Customer</th>
                <th className="purchase-table-th">Product</th>
                <th className="purchase-table-th">Quantity</th>
                <th className="purchase-table-th">Price</th>
                <th className="purchase-table-th">Total</th>
              </tr>
            </thead>
            <tbody className="purchase-table-body">
              {purchases.map((purchase, index) => (
                <tr key={index} className="purchase-table-row">
                  <td className="purchase-table-td">
                    {formatDate(purchase.purchased_at)}
                  </td>
                  <td className="purchase-table-td">
                    {purchase.customer_email}
                  </td>
                  <td className="purchase-table-td purchase-table-td-product">
                    <div className="purchase-product-info">
                      {purchase.product_image_url && (
                        <img
                          src={purchase.product_image_url}
                          alt={purchase.product_name}
                          className="purchase-product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="purchase-product-name">
                        {purchase.product_name}
                      </span>
                    </div>
                  </td>
                  <td className="purchase-table-td">
                    {purchase.quantity}
                  </td>
                  <td className="purchase-table-td">
                    ${parseFloat(purchase.price).toFixed(2)}
                  </td>
                  <td className="purchase-table-td purchase-table-td-total">
                    ${parseFloat(purchase.subtotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;




