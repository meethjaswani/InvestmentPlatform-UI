# Investment Platform - Portfolio Management Dashboard

A comprehensive, production-ready portfolio management dashboard built with modern web technologies for tracking, analyzing, and managing investment portfolios. This application provides a complete solution for individual investors to monitor their financial assets, track performance, and make informed investment decisions.
<img width="1273" height="664" alt="Screenshot 2025-08-28 at 4 03 09 PM" src="https://github.com/user-attachments/assets/caf33fa2-c1f6-4849-8f7d-36891e28e1c5" />
<img width="1266" height="671" alt="Screenshot 2025-08-28 at 4 05 51 PM" src="https://github.com/user-attachments/assets/42082935-abf2-44b0-983a-64d861a4e3f6" />
<img width="1267" height="661" alt="Screenshot 2025-08-28 at 4 06 18 PM" src="https://github.com/user-attachments/assets/c716c7b5-c90c-49b9-83f3-3c280d10fa24" />
<img width="1261" height="634" alt="Screenshot 2025-08-28 at 4 06 55 PM" src="https://github.com/user-attachments/assets/57e1d894-aedb-42d0-aede-23183a431d76" />



### For Manual Setup
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git**

## Getting Started

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




## Project Structure

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



