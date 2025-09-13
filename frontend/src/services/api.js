import axios from 'axios';

// API base configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add auth token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

// Product services
export const productService = {
  // Public endpoints
  getAllProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Supplier endpoints
  getSupplierProducts: () => api.get('/supplier/products'),
  createProduct: (data) => api.post('/supplier/products', data),
  updateProduct: (id, data) => api.put(`/supplier/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/supplier/products/${id}`),
  getPurchases: () => api.get('/supplier/purchases'),
};

// Order services
export const orderService = {
  getOrders: () => api.get('/customer/orders'),
  checkout: (items) => api.post('/customer/checkout', { items }),
  getOrder: (id) => api.get(`/customer/orders/${id}`),
  cancelOrder: (id) => api.post(`/customer/orders/${id}/cancel`),
};

export default api;

