import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Register component - handles new user registration
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Handle validation errors
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.error) {
        setErrors({ general: result.error });
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="text-center mb-6">
          <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
            Create your account
          </h2>
          <p style={{color: '#6b7280'}}>
            Or{' '}
            <Link to="/login" style={{color: '#4f46e5', fontWeight: '500'}}>
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer (Shop Products)</option>
              <option value="supplier">Supplier (Sell Products)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p style={{color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem'}}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password (minimum 8 characters)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && (
              <p style={{color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem'}}>
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{width: '100%', marginTop: '1rem'}}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

