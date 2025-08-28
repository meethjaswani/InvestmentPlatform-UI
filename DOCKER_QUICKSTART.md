# Docker Quickstart Guide

## 🚀 Quick Start

### 1. Prerequisites
- Docker installed
- Docker Compose installed

### 2. Run the Application
```bash
# Clone and navigate to project
git clone <your-repo>
cd InvestmentPlatform

# Build and start services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📋 Basic Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Rebuild and restart
docker-compose up --build -d
```

## 🐳 What's Included

- **Backend**: Node.js/Express API with SQLite database
- **Frontend**: React app served by Nginx
- **Database**: SQLite with persistent volume
- **Network**: Isolated Docker network

## 🔧 Troubleshooting

**Port conflicts**: Stop any existing services on ports 80 or 3001
**Build issues**: Run `docker-compose build --no-cache`
**Database issues**: Run `docker-compose down -v` then restart

## 📁 Files

- `backend/Dockerfile` - Backend container configuration
- `frontend/Dockerfile` - Frontend container configuration  
- `docker-compose.yml` - Service orchestration
- `frontend/nginx.conf` - Nginx configuration
