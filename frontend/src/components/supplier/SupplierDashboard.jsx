import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import PurchaseHistory from './PurchaseHistory';

/**
 * Supplier Dashboard - main dashboard for suppliers to manage products
 */
const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'purchases') {
      loadPurchases();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getSupplierProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await productService.getPurchases();
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSave = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      loadProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      throw error;
    }
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Supplier Dashboard</h1>
          <p>Manage your products and view sales</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <nav className="tabs-nav">
            <button
              onClick={() => setActiveTab('products')}
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
            >
              Purchase History
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2>Your Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="btn"
              >
                Add New Product
              </button>
            </div>

            {showProductForm && (
              <ProductForm
                product={editingProduct}
                onSave={handleProductSave}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
              />
            )}

            {loading ? (
              <div className="loading-message">Loading products...</div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleProductDelete}
              />
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <h2 className="section-title">Purchase History</h2>
            {loading ? (
              <div className="loading-message">Loading purchases...</div>
            ) : (
              <PurchaseHistory purchases={purchases} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
