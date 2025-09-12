import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/api';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

/**
 * CustomerDashboard - main dashboard for customers to shop and manage orders
 */
const CustomerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'shop');

  // Update activeTab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'shop';
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'shop') {
      loadProducts();
    }
  }, [activeTab, searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await productService.getAllProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Customer Dashboard</h1>
          <p>Browse products and manage your orders</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <nav className="tabs-nav">
            <button
              onClick={() => handleTabChange('shop')}
              className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
            >
              Shop
            </button>
            <button
              onClick={() => handleTabChange('cart')}
              className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
            >
              Cart
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            >
              Order History
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'shop' && (
          <div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            {loading ? (
              <div className="loading-message">Loading products...</div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        )}

        {activeTab === 'cart' && <Cart />}
        {activeTab === 'orders' && <OrderHistory />}
      </div>
    </div>
  );
};

export default CustomerDashboard;




