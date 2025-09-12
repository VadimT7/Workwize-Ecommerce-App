# Multi-Supplier E-Commerce Demo

A simple e-commerce application where multiple suppliers can register and add products, and customers can shop across all suppliers. Built with Laravel (backend) and React (frontend).

# Access the Application
  The application was deployed on Railway and can be accessed through the following link:  
https://workwize-ecommerce-app-production.up.railway.app/

# Demo
**Customer Dashboard:**  
1. Product Shop:  
   <img width="1876" height="1049" alt="image" src="https://github.com/user-attachments/assets/5aafae99-cfec-4052-93e7-e923ddb1ba4e" />
2. Shopping Cart:  
   <img width="1882" height="1054" alt="image" src="https://github.com/user-attachments/assets/ad68fca6-0df9-4809-86f6-6ccf4ef4d1ec" />
3. Order History:  
   <img width="1883" height="1058" alt="image" src="https://github.com/user-attachments/assets/3eecc9f5-a063-4180-bb39-f0b266c82af4" />  


  
---

  

**Supplier Dashboard:**  
1. Product Line-up:  
   <img width="1883" height="1053" alt="image" src="https://github.com/user-attachments/assets/a7d68095-357f-4648-acef-7dcd0bd644a4" />  
2. Purchase History:    
   <img width="1880" height="1053" alt="image" src="https://github.com/user-attachments/assets/010091c4-c624-488a-906c-1780d1ce43a3" />



## Features

### Supplier Interface
- Register/Login as Supplier
- Full CRUD operations for products
- View purchase history with customer details
- Dashboard with sales analytics

### Customer Interface  
- Register/Login as Customer
- Browse all products from all suppliers
- Shopping cart with local storage persistence
- Checkout and order management
- Order history with cancellation option

## Tech Stack

- **Backend**: Laravel 12 with Breeze API authentication
- **Frontend**: React 18 with Vite
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

## Directory Structure

```
project-root/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   ├── routes/
│   ├── database/migrations/
│   └── ...
├── frontend/         # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   └── ...
└── README.md
```

## Installation & Setup

### Prerequisites
- PHP 8.2+ with MySQL extension enabled
- Composer
- Node.js 18+
- MySQL Server
- Git

**Note**: Ensure PHP has the MySQL extension enabled. In `php.ini`, uncomment:
```
extension=pdo_mysql
extension=mysqli
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Create MySQL database named `ecommerce_demo`

5. Update `.env` file with your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_demo
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start Laravel server:
```bash
php artisan serve
```
The backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```
The frontend will run on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Register as either a **Supplier** or **Customer**
3. **As Supplier**: Add products, manage inventory, view sales
4. **As Customer**: Browse products, add to cart, checkout, view orders

## Key Architecture Decisions

- **Role-based authentication**: Simple role field on User model (supplier/customer)
- **Cart persistence**: Local storage for cart state
- **Payment simulation**: Orders marked as paid automatically for demo purposes
- **Clean separation**: Supplier and customer interfaces are completely separate
- **Modular components**: Each feature is contained in its own component
- **API-first design**: Complete separation between frontend and backend

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product

### Supplier Routes (Protected)
- `GET /api/supplier/products` - Get supplier's products
- `POST /api/supplier/products` - Create product
- `PUT /api/supplier/products/{id}` - Update product
- `DELETE /api/supplier/products/{id}` - Delete product
- `GET /api/supplier/purchases` - Get purchase history

### Customer Routes (Protected)
- `GET /api/customer/orders` - Get customer's orders
- `POST /api/customer/checkout` - Create order
- `GET /api/customer/orders/{id}` - Get order details
- `POST /api/customer/orders/{id}/cancel` - Cancel order

## Improvements with More Time

- **Enhanced Security**: Implement Laravel Sanctum token refresh, rate limiting, and input sanitization
- **Real Payment Integration**: Integrate Stripe or PayPal for actual payment processing
- **Admin Dashboard**: Create admin panel for platform management
- **Test Coverage**: Add unit and integration tests (Jest for React, PHPUnit for Laravel)
- **UX Enhancements**: Add loading states, toast notifications, and improved error handling
- **Mobile Responsiveness**: Further optimize for mobile devices
- **Image Upload**: Allow suppliers to upload product images instead of URLs
- **Advanced Features**: Product categories, search filters, reviews and ratings
- **Performance**: Implement caching, pagination, and query optimization
- **Deployment**: Docker configuration and CI/CD pipeline setup

## Development Time

This project was built within a 6-8 hour timeframe, focusing on core functionality and clean, maintainable code rather than exhaustive features.

## License

MIT

## Contributors

Built as a technical case study demonstration.
