import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SupplierDashboard from './components/supplier/SupplierDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProductGrid from './components/customer/ProductGrid';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { productService } from './services/api';

/**
 * Dashboard - redirects to appropriate dashboard based on user role
 */
const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'supplier') {
    return <SupplierDashboard />;
  } else if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }
  
  return <Navigate to="/login" replace />;
};

/**
 * HomePage - landing page with product showcase
 */
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts({ in_stock: true });
      setProducts(response.data.slice(0, 8)); // Show first 8 products
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Welcome to Multi-Supplier E-Commerce</h1>
          <p>Shop from multiple suppliers or become a supplier yourself</p>
          
          {!isAuthenticated && (
            <div className="hero-buttons">
              <a href="/register" className="btn">
                Get Started
              </a>
              <a href="/login" className="btn btn-secondary">
                Sign In
              </a>
            </div>
          )}
          
          {isAuthenticated && (
            <div>
              Welcome back, {user?.name}!
              <a href="/dashboard" className="btn" style={{marginLeft: '1rem'}}>
                Go to Dashboard →
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="products-section">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="text-center">No products available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * App - main application component with routing
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/products"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;