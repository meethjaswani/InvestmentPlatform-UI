# Investment Platform - Portfolio Management Dashboard

A comprehensive, production-ready portfolio management dashboard built with modern web technologies for tracking, analyzing, and managing investment portfolios. This application provides a complete solution for individual investors to monitor their financial assets, track performance, and make informed investment decisions.
<img width="1261" height="634" alt="Screenshot 2025-08-28 at 4 06 55 PM" src="https://github.com/user-attachments/assets/57e1d894-aedb-42d0-aede-23183a431d76" />
<img width="1267" height="661" alt="Screenshot 2025-08-28 at 4 06 18 PM" src="https://github.com/user-attachments/assets/c716c7b5-c90c-49b9-83f3-3c280d10fa24" />
<img width="1266" height="671" alt="Screenshot 2025-08-28 at 4 05 51 PM" src="https://github.com/user-attachments/assets/42082935-abf2-44b0-983a-64d861a4e3f6" />
<img width="1273" height="664" alt="Screenshot 2025-08-28 at 4 03 09 PM" src="https://github.com/user-attachments/assets/caf33fa2-c1f6-4849-8f7d-36891e28e1c5" />

## 📋 Prerequisites

### For Docker Deployment (Recommended)
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### For Manual Setup
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git**

## 🚀 Getting Started

### Option 1: Docker (Recommended)

The easiest way to run the application is using Docker. This ensures consistent environments across different machines.

#### Prerequisites
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

#### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/meethjaswani/InvestmentPlatform-UI.git
cd InvestmentPlatform-UI

# Build and start services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

This will:
- Build Docker images for both frontend and backend
- Start all services
- Open the application at http://localhost:80

#### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View service status
docker-compose ps

# Rebuild and restart
docker-compose up --build -d
```

### Option 2: Manual Setup

If you prefer to run the application without Docker, follow these steps:

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/InvestmentPlatform.git
cd InvestmentPlatform
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your configuration

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3001`

#### 3. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will start on `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the backend directory with these variables:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your_secret_key_here
DATABASE_URL=./database/investment_platform.db
```

## 🌟 **Project Overview**

### User Authentication
- **User Registration & Login** - Express.js routes with JWT tokens
- **Password Security** - bcryptjs hashing
- **Session Management** - JWT middleware

### Portfolio Management
- **Portfolio Overview** - React components with real-time data
- **Performance Charts** - Chart.js with React-Chartjs-2
- **Asset Allocation** - Visual breakdown by investment type
- **Profit/Loss Tracking** - Calculations with percentage returns

### Investment Operations
- **Add Investments** - Form with validation
- **Edit Investments** - Update functionality
- **Delete Investments** - Remove with confirmation
- **Investment List** - Table display with actions

### User Interface
- **Dark/Light Theme** - CSS variables with React context
- **Responsive Design** - Mobile-first CSS
- **Modern UI** - Clean, professional styling
- **Interactive Elements** - Hover effects and animations

## 🚀 Features

### 🔐 **Authentication & Security**
- **User Registration & Login**: Secure account creation with email/password
- **JWT Token Authentication**: Stateless authentication with automatic token refresh
- **Password Hashing**: Bcrypt-based password security
- **Session Management**: Secure user sessions with token expiration
- **Input Validation**: Comprehensive server-side validation for all forms

### 📊 **Portfolio Management**
- **Real-time Portfolio Overview**: Live tracking of total invested, current value, and P&L
- **Investment Dashboard**: Visual representation of portfolio performance over time
- **Asset Allocation Charts**: Interactive breakdown by investment type (stocks, bonds, crypto, etc.)
- **Performance Metrics**: Detailed profit/loss calculations with percentage returns
- **Portfolio Analytics**: Historical performance tracking and trend analysis

### 💼 **Investment Operations**
- **Add Investments**: Support for multiple asset types with detailed metadata
- **Edit Investments**: Update investment details, quantities, and prices
- **Delete Investments**: Remove investments with confirmation
- **Investment History**: Track all changes and modifications
- **Symbol Management**: Stock symbols and investment identifiers
- **Purchase Date Tracking**: Historical investment timeline

### 📱 **User Experience**
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Modern UI/UX**: Clean, professional interface following modern design principles
- **Interactive Charts**: Chart.js powered portfolio performance visualization
- **Real-time Updates**: Live data refresh and dynamic content loading

### 🔧 **Technical Features**
- **RESTful API**: Comprehensive backend API with proper HTTP methods
- **Database Persistence**: SQLite database with Sequelize ORM
- **Error Handling**: Graceful error handling with user-friendly messages
- **Logging & Monitoring**: Comprehensive logging for debugging and monitoring
- **API Rate Limiting**: Protection against abuse and DDoS attacks

## 🏗️ Project Structure

```
InvestmentPlatform/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── models/            # Sequelize database models
│   │   ├── routes/            # API route handlers
│   │   ├── middleware/        # Authentication middleware
│   │   ├── controllers/       # Business logic controllers
│   │   ├── config/           # Database configuration
│   │   └── app.js            # Main application file
│   ├── database/             # SQLite database files
│   └── package.json          # Backend dependencies
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS styling files
│   ├── public/              # Static files
│   └── package.json         # Frontend dependencies
├── .gitignore               # Git ignore rules
└── README.md               # Project documentation
```

## 🛠️ Technologies Used

### 🖥️ **Backend Technologies**
- **Node.js** (v18+) - JavaScript runtime environment for server-side execution
- **Express.js** (v4.18+) - Fast, unopinionated web framework for Node.js
- **SQLite** (v5.1+) - Lightweight, serverless database engine
- **Sequelize** (v6.35+) - Promise-based Node.js ORM for database operations
- **JWT** (v9.0+) - JSON Web Tokens for stateless authentication
- **bcryptjs** (v2.4+) - Library for hashing passwords with salt
- **cors** (v2.8+) - Cross-Origin Resource Sharing middleware
- **dotenv** (v16.3+) - Environment variable management
- **nodemon** (v3.0+) - Development server with auto-restart

### 🎨 **Frontend Technologies**
- **React** (v18.2+) - JavaScript library for building user interfaces
- **React Router DOM** (v6.8+) - Declarative routing for React applications
- **Chart.js** (v4.5+) - Flexible JavaScript charting library
- **React-Chartjs-2** (v5.3+) - React wrapper for Chart.js
- **Axios** (v1.6+) - Promise-based HTTP client for API communication
- **CSS3** - Modern CSS with custom properties, Grid, Flexbox, and animations
- **Web Vitals** - Core web metrics for performance monitoring

### 🐳 **DevOps & Containerization**
- **Docker** (v20.10+) - Platform for developing, shipping, and running applications
- **Docker Compose** (v2.0+) - Tool for defining and running multi-container applications
- **Nginx** (Alpine) - High-performance web server and reverse proxy
- **Multi-stage Builds** - Optimized Docker images with build and runtime stages
- **Volume Management** - Persistent data storage for databases
- **Network Isolation** - Secure container communication

### 🗄️ **Database & Data Management**
- **SQLite** - Serverless, zero-configuration database
- **Sequelize ORM** - Object-Relational Mapping with automatic table creation
- **Database Migrations** - Version-controlled database schema management
- **Data Validation** - Server-side input validation and sanitization
- **Transaction Support** - ACID-compliant database operations

### 🔒 **Security & Authentication**
- **JWT Tokens** - Secure, stateless authentication mechanism
- **Password Hashing** - Bcrypt-based password security with salt rounds
- **CORS Protection** - Cross-origin request security
- **Input Sanitization** - Protection against injection attacks
- **Rate Limiting** - API abuse prevention
- **Secure Headers** - Security-focused HTTP response headers

## 📋 Prerequisites

### For Docker Deployment (Recommended)
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### For Manual Setup
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git**

## 🐳 Docker Architecture

The application is containerized using Docker with the following architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (SQLite)      │
│   Port 80       │    │   Port 3001     │    │   Volume        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Container Features
- **Multi-stage builds** for optimized image sizes
- **Volume persistence** for database data
- **Network isolation** between services
- **Automatic restart** policies

## 📊 **API Documentation**

### **Base URL**
```
http://localhost:3001/api (Development)
http://localhost:80/api (Production via Docker)
```

### **Authentication Endpoints**
- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/login` - User authentication and JWT token generation
- `GET /api/auth/me` - Get current user profile (protected)
- `POST /api/auth/logout` - User logout and token invalidation
- `POST /api/auth/refresh` - Refresh expired JWT tokens
- `GET /api/auth/verify` - Verify token validity

### **Portfolio Endpoints**
- `GET /api/portfolio` - Complete portfolio with performance metrics
- `GET /api/portfolio?sortBy=name&order=ASC` - Sorted portfolio data
- `GET /api/portfolio?limit=10&offset=0` - Paginated portfolio results
- `GET /api/portfolio/performance?period=1M` - Performance analytics

### **Investment Management**
- `GET /api/investments` - List all user investments
- `POST /api/investments` - Create new investment with validation
- `GET /api/investments/:id` - Get specific investment details
- `PUT /api/investments/:id` - Update investment information
- `DELETE /api/investments/:id` - Remove investment from portfolio

### **Transaction History**
- `GET /api/transactions` - Get all investment transactions
- `POST /api/transactions` - Record new transaction
- `GET /api/transactions/investment/:id` - Get transactions for specific investment

### **Health & Monitoring**
- `GET /api/health` - API health check endpoint
- `GET /health` - Frontend health check (Nginx)

### **Response Format**
All API responses follow a consistent structure:
```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {...},
  "errors": [...],
  "pagination": {...}
}
```

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Investments**: Navigate to the Investments page and add your first investment
3. **View Dashboard**: Check your portfolio overview and performance metrics
4. **Portfolio Analysis**: Review asset allocation and portfolio analytics
5. **Manage Investments**: Edit or delete investments as needed

## 🚀 Deployment

### Docker Deployment (Recommended)

The application is production-ready with Docker and includes:

- **Production-optimized builds** with multi-stage Dockerfiles
- **Nginx reverse proxy** for serving the React app
- **Volume persistence** for database data
- **Automatic restart** policies
- **Network isolation** between services

#### Production Deployment Steps

1. **Set Production Environment Variables**
   ```bash
   # Edit docker-compose.yml and update JWT_SECRET
   JWT_SECRET=your_super_secure_production_secret
   ```

2. **Deploy with Docker Compose**
   ```bash
   # Build and start services
   docker-compose up -d --build
   
   # Check service status
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   ```

### Traditional Deployment

#### Backend Deployment
1. Set environment variables for production
2. Change `NODE_ENV` to `production`
3. Use a production-ready database (PostgreSQL/MySQL)
4. Deploy to platforms like Heroku, AWS, or DigitalOcean

#### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to platforms like Netlify, Vercel, or AWS S3

## 🛠️ **Development & Contributing**

### **Development Setup**

#### **Prerequisites for Development**
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (v2.30.0 or higher)
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - React Developer Tools
  - Node.js Extension Pack

#### **Local Development Commands**
```bash
# Backend Development
cd backend
npm install
npm run dev          # Start with nodemon (auto-restart)
npm run db:setup    # Initialize database
npm run db:seed     # Add sample data

# Frontend Development
cd frontend
npm install
npm start           # Start React dev server
npm run build      # Production build
npm test           # Run tests
```

#### **Database Management**
```bash
# Database operations
npm run db:init    # Initialize database schema
npm run db:reset   # Reset database (WARNING: deletes all data)
npm run db:seed    # Add sample investment data
```
