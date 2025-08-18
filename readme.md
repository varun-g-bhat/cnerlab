# CNER Lab

A full-stack web application for managing users, components, carts, permissions, purchase history, reminders, and statistics. Built with React (Vite) frontend and Node.js/Express backend, using Prisma ORM for database management.

---

## 🚀 Features

- **User Authentication & Authorization**
  - Signup, Login, JWT-based authentication
  - Role-based access control (Admin/User)
- **Component Management**
  - CRUD operations for lab components
  - Admin-only access for component management
- **Cart System**
  - Add/remove components to/from cart
  - Checkout and purchase history tracking
- **Permissions**
  - Request and manage permissions for components
  - Admin approval workflow
- **Purchase History**
  - Track user purchases
  - Admin view of all purchase records
- **Statistics**
  - View usage statistics for components and users
- **Email Notifications**
  - OTP for signup/login
  - Email notifications for permissions and reminders
- **Responsive Frontend**
  - Modern UI with protected routes
  - Admin dashboard and user dashboard
- **API Security**
  - Global error handling
  - Input validation

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL (or compatible database)

### 1. Clone the Repository

```bash
git clone https://github.com/varun-g-bhat/cnerlab.git
cd cnerlab-lab-backend-main
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Configure Environment

- Create a `.env` file in the `server` folder with your database and email credentials.
- Update `prisma/schema.prisma` with your database connection string if needed.

### 4. Setup Database

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 5. Run the Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:8000`

### 6. Run the Frontend

```bash
cd ../client
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📖 API Endpoints

### Auth

- `POST /api/v1/auth/signup`  
  User registration (with OTP email verification)

- `POST /api/v1/auth/login`  
  User login (returns JWT)

- `POST /api/v1/auth/send-otp`  
  Send OTP to email

- `GET /api/v1/auth/me`  
  Get current user info (JWT required)

---

### Components

- `GET /api/v1/components`  
  List all components

- `GET /api/v1/components/:id`  
  Get component details

- `POST /api/v1/components`  
  Create new component (Admin only)

- `PUT /api/v1/components/:id`  
  Update component (Admin only)

- `DELETE /api/v1/components/:id`  
  Delete component (Admin only)

---

### Cart

- `GET /api/v1/cart`  
  Get user's cart

- `POST /api/v1/cart`  
  Add item to cart

- `DELETE /api/v1/cart/:id`  
  Remove item from cart

---

### Permissions

- `GET /api/v1/permissions`  
  List all permission requests

- `POST /api/v1/permissions`  
  Request permission for a component

- `PUT /api/v1/permissions/:id`  
  Update permission status (Admin only)

- `DELETE /api/v1/permissions/:id`  
  Delete permission request

---

### Purchase History

- `GET /api/v1/purchase-history`  
  Get user's purchase history

- `POST /api/v1/purchase-history`  
  Add a purchase record

---

### Reminders

- `GET /api/v1/reminders`  
  List all reminders

- `POST /api/v1/reminders`  
  Create a reminder

- `PUT /api/v1/reminders/:id`  
  Update a reminder

- `DELETE /api/v1/reminders/:id`  
  Delete a reminder

---

### Statistics

- `GET /api/v1/statistics`  
  Get usage statistics (Admin only)

---

## 📝 Notes

- All endpoints prefixed with `/api/v1/`
- Most endpoints require JWT authentication
- Admin-only endpoints are protected by role-based middleware

---
