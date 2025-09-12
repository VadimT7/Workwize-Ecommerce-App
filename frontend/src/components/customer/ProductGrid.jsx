import { useCart } from '../../contexts/CartContext';

/**
 * ProductGrid - displays products in a grid layout for customers
 */
const ProductGrid = ({ products }) => {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (product.stock_quantity > 0) {
      addToCart(product, 1);
      // Show feedback (could be improved with toast notification)
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          {!product.image_url && (
            <div className="product-image-placeholder">
              <span>No image</span>
            </div>
          )}
          
          <div className="product-content">
            <h3 className="product-name">
              {product.name}
            </h3>
            
            <p className="product-supplier">
              by {product.supplier?.name || 'Unknown Supplier'}
            </p>
            
            <p className="product-description">
              {product.description || 'No description available'}
            </p>
            
            <div className="product-price-row">
              <span className="product-price">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className={`product-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock_quantity === 0}
              className={`product-button ${product.stock_quantity > 0 ? 'add-to-cart' : 'out-of-stock'}`}
            >
              {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;




