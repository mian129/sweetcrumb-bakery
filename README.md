# Sweet Crumb Bakery Website

A 3D animated bakery website with admin panel for easy management.

## Features

### Frontend (Customer View)
- 3D animated homepage with Three.js
- Responsive design
- Menu with product filtering
- Gallery with Instagram images
- Contact form
- Order placement

### Admin Panel
- Dashboard with stats
- Add/Edit/Delete products
- Manage orders
- Update order status
- No coding needed

## Tech Stack

- **Frontend:** React.js, Three.js, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Styling:** Custom CSS

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed or MongoDB Atlas account

### 1. Clone the project
```bash
cd D:\sweetcrumb-bakery
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweetcrumb
JWT_SECRET=your_secret_key
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

### 4. Setup Admin Panel
```bash
cd ../admin
npm install
npm start
```

### 5. Create Admin Account
1. Go to http://localhost:3000 (admin panel)
2. Register a new account
3. Start adding products!

## Project Structure

```
sweetcrumb-bakery/
├── backend/           # API Server
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── middleware/    # Auth middleware
├── frontend/         # Customer website
│   └── src/
│       ├── pages/    # Page components
│       └── components/ # Reusable components
└── admin/            # Admin dashboard
    └── src/
        ├── pages/    # Admin pages
        └── components/ # Admin components
```

## Default Categories
- Cookies
- Cupcakes
- Cakes
- Pastries
- Other

## API Endpoints

### Auth
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Orders
- GET /api/orders - Get all orders (admin)
- POST /api/orders - Create order
- PUT /api/orders/:id - Update order status (admin)
