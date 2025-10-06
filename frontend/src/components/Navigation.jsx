import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

/**
 * Navigation - main navigation bar component
 */
const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, deleteAccount, isSupplier, isCustomer } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. Your orders will be kept for tax audit purposes, but all your personal information will be permanently removed.'
    );
    
    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      'This is your final warning. Deleting your account will:\n\n' +
      '• Permanently remove your name, email, and personal information\n' +
      '• Prevent you from logging in again\n' +
      '• Keep your order history for tax audit purposes (10 years)\n\n' +
      'Are you absolutely sure you want to proceed?'
    );

    if (!doubleConfirmed) return;

    try {
      const result = await deleteAccount();
      if (result.success) {
        alert('Your account has been successfully deleted.');
        navigate('/login');
      } else {
        alert(`Failed to delete account: ${result.error}`);
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      alert('An error occurred while deleting your account. Please try again.');
    }
  };

  return (
    <nav>
      <div className="container">
        <div className="nav-content">
          <div className="nav-left">
            <Link to="/">
              <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>E-Commerce Demo</span>
            </Link>
            
            {isAuthenticated && (
              <div className="nav-links">
                {isCustomer() && (
                  <Link to="/products">
                    Browse Products
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                {isCustomer() && (
                  <Link to="/products?tab=cart" style={{position: 'relative'}}>
                    🛒
                    {getCartCount() > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#4f46e5',
                        color: 'white',
                        fontSize: '0.75rem',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                )}
                
                <div className="flex items-center gap-4">
                  <span>{user?.name}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    {user?.role}
                  </span>
                </div>
                
                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
                <button 
                  onClick={handleDeleteAccount} 
                  className="btn btn-danger"
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: '1px solid #dc2626'
                  }}
                >
                  Delete Account
                </button>
              </>
            ) : (
              <div style={{display: 'flex', gap: '1rem'}}>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;




