# EcoSync Hub - Sustainable Lifestyle Platform

## 📌 Project Overview

**EcoSync Hub** is a full-stack web application designed to empower users to live a more sustainable lifestyle. It combines an eco-friendly marketplace, community engagement features, and gamified challenges to track and reduce carbon footprints.

### 🚀 Key Features

- **Eco-Marketplace**: Buy and sell sustainable products (bamboo toothbrushes, solar gadgets, etc.).
- **Community Hub**: Share posts with images, like, and comment on others' eco-journeys.
- **Gamified Challenges**: Join challenges like "Plastic Free Week" to earn Eco-Points and track CO2 savings.
- **Real-Time Messaging**: Chat with sellers or friends instantly.
- **Carbon Tracking**: Automatically logs carbon savings from purchases and completed challenges.
- **User Profiles**: Custom avatars, bio, and stats (Trees Planted, CO2 Saved).
- **Admin Dashboard**: Manage users, products, and view platform statistics.

---

## 🛠️ Tech Stack

This project uses a modern, robust architecture:

- **Frontend**: 
  - **React.js** (Vite) for a fast, responsive UI.
  - **Material UI (MUI)** for a polished, accessible design system.
  - **Axios** for API communication.

- **Backend**: 
  - **Node.js & Express** for a scalable REST API.
  - **Socket.io** for real-time features (chat).
  - **Bcrypt & JWT** for secure authentication.

- **Database**: 
  - **MySQL** for relational data storage (Users, Orders, Products, etc.).

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js** (v14 or higher) installed.
- **MySQL Server** installed and running (or XAMPP).

### 2. Database Configuration

1. **Create the Database**:
   - Open your MySQL client (Workbench, Command Line, or phpMyAdmin).
   - Run: `CREATE DATABASE ecosync_hub;`

2. **Import Schema**:
   - Import the provided `ecosync_hub.sql` file into the `ecosync_hub` database.
   - *Note*: This schema includes optimized indexes for search performance and triggers for eco-point calculation.
   - *Command Line*: `mysql -u root -p ecosync_hub < ecosync_hub.sql`

3. **Configure Backend**:
   - Ensure `backend/.env` has correct DB credentials:

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=ecosync_hub
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

### 3. Installation

Open a terminal in the project root folder:

```bash
# Install dependencies for both Frontend and Backend
npm run install:all
```

### 4. Running the App

Start both the backend server and frontend client with a single command:

```bash
npm run dev
```

- **Frontend**: Visit [http://localhost:5173](http://localhost:5173)
- **Backend**: API running at [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing & Verification

You can verify the system integrity using the included test script:

```bash
python test_api.py
```

This comprehensive script will:
- **Authenticate** as Admin, Seller, and New User to test Role-Based Access Control (RBAC).
- **Create Data**: Categories, Products, Challenges, Posts using reliable images.
- **Simulate User Flow**: Orders, Messages, Friend Requests, and Carbon Logging.
- **Verify Responses**: Ensure all API endpoints return success status codes.

---

## 🎨 Professional Enhancements (New!)

In this final version, we've added:
- **Studio Imagery**: Default products now feature professional photography assets served locally.
- **Glassmorphism UI**: High-contrast, premium styling adapted for better visibility on green brand backgrounds.
- **Data Integrity**: Database schema refactored with `NOT NULL` constraints and smart defaults to ensure platform stability.
- **Improved UX**: Unified impact reporting and carbon tracking dashboard.

---

## 📂 Project Structure

- **/frontend**: React application source code.
- **/backend**: Express server, API routes, and database connection.
- **/backend/routes**: API endpoint definitions.
- **ecosync_hub.sql**: Robust database schema with pre-seeded eco-data.

---

## 👨‍💻 Author

**Rakibul Hasan**  
B.Sc in Computer Science & Engineering  
United International University
