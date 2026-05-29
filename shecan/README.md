# 🌸 She Can Foundation — Full Stack Web App

A complete Full Stack project built for the **She Can Foundation** internship selection task.

**Tech Stack:** React.js · Node.js · Express.js · MySQL · JWT Auth

---

## 📁 Project Structure

```
shecan/
├── backend/          # Node.js + Express API
│   ├── config/
│   │   ├── db.js         # MySQL connection pool
│   │   └── init.sql      # Database setup script
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js       # Admin login + verify
│   │   ├── submissions.js # Contact form CRUD
│   │   └── volunteers.js  # Volunteer registration CRUD
│   ├── server.js         # Express app entry point
│   ├── .env.example      # Environment variables template
│   └── package.json
│
└── frontend/         # React.js app
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js     # Global auth state
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── ProtectedRoute.js
        ├── pages/
        │   ├── Home.js            # Landing page
        │   ├── Contact.js         # Public contact form
        │   ├── Volunteer.js       # Volunteer registration
        │   ├── AdminLogin.js      # Admin login
        │   ├── AdminDashboard.js  # Stats overview
        │   ├── AdminSubmissions.js # Manage messages
        │   └── AdminVolunteers.js  # Manage volunteers
        ├── api.js                 # Axios API client
        ├── App.js                 # Routes
        ├── index.js
        └── index.css
```

---

## ⚙️ Setup Instructions

### Step 1: Set Up MySQL Database

Open MySQL and run:
```sql
SOURCE /path/to/shecan/backend/config/init.sql;
```

This creates:
- `shecan_db` database
- `admins`, `submissions`, `volunteers` tables
- Default admin account

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shecan_db
JWT_SECRET=your_secret_key
```

Install dependencies and start:
```bash
npm install
npm run dev       # Development (nodemon)
# or
npm start         # Production
```

API runs on: `http://localhost:5000`

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm start
```

App runs on: `http://localhost:3000`

---

## 🌐 Pages & Features

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Home page with stats, programs, CTA |
| `/contact` | Contact form with subject + validation |
| `/volunteer` | Volunteer registration with skills picker |

### Admin Panel
| Route | Description |
|-------|-------------|
| `/admin/login` | Secure JWT login |
| `/admin/dashboard` | Stats overview + recent submissions |
| `/admin/submissions` | View, filter, update status, delete messages |
| `/admin/volunteers` | View, filter, approve/reject volunteer applications |

---

## 🔐 Admin Credentials (Default)

| Field | Value |
|-------|-------|
| Email | admin@shecanfoundation.org |
| Password | Admin@123 |

> ⚠️ Change these after first login in production.

---

## 🚀 API Endpoints

### Auth
```
POST   /api/auth/login         - Admin login → returns JWT token
GET    /api/auth/me            - Verify token, get admin info
```

### Submissions (Contact Form)
```
POST   /api/submissions        - Submit contact form (public)
GET    /api/submissions        - Get all submissions (admin)
PATCH  /api/submissions/:id/status - Update status (admin)
DELETE /api/submissions/:id    - Delete submission (admin)
```

### Volunteers
```
POST   /api/volunteers         - Register as volunteer (public)
GET    /api/volunteers         - Get all volunteers (admin)
PATCH  /api/volunteers/:id/status - Approve/reject (admin)
GET    /api/volunteers/stats   - Summary stats (admin)
```

### Dashboard
```
GET    /api/dashboard/stats    - All stats + recent submissions (admin)
```

---

## ✨ Features Implemented

- ✅ React Frontend with React Router
- ✅ Node.js + Express REST API
- ✅ MySQL Database with proper schema
- ✅ JWT Authentication for Admin
- ✅ Protected Routes
- ✅ Contact Form with Validation (frontend + backend)
- ✅ Volunteer Registration with Skills Selection
- ✅ Admin Dashboard with Live Stats
- ✅ Submissions Management (read, status update, delete)
- ✅ Volunteer Management (approve/reject)
- ✅ Pagination + Filtering
- ✅ Responsive Design
- ✅ Form Validation (client-side + server-side)
- ✅ Error Handling (global interceptors + proper HTTP codes)
- ✅ "Form Submitted Successfully" message on submit ✓

---

## 🛠️ Built With

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios |
| Backend | Node.js, Express 4 |
| Database | MySQL 8 (mysql2) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
