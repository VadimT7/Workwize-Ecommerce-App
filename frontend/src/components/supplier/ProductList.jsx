/**
 * ProductList - displays list of supplier's products
 */
const ProductList = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="empty-state-card">
        <p>No products yet. Add your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-list-item">
            <div className="product-list-content">
              <div className="product-list-main">
                <div className="product-list-info">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-list-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="product-list-details">
                    <p className="product-list-name">
                      {product.name}
                    </p>
                    <p className="product-list-description">
                      {product.description || 'No description'}
                    </p>
                    <div className="product-list-meta">
                      <span className="product-list-price">${parseFloat(product.price).toFixed(2)}</span>
                      <span className="product-list-separator">•</span>
                      <span className="product-list-stock">
                        Stock: {product.stock_quantity}
                        {product.stock_quantity === 0 && (
                          <span className="out-of-stock-text">(Out of stock)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="product-list-actions">
                  <button
                    onClick={() => onEdit(product)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;




