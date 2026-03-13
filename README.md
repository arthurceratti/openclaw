# Student Management System

A full-stack web application for managing students, courses, and user roles with JWT-based authentication and Docker containerization.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Setup Instructions](#-setup-instructions)
- [Deployment Guide](#-deployment-guide)
- [API Endpoints](#-api-endpoints)
- [Configuration](#-configuration)
- [Build Instructions](#-build-instructions)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- **User Authentication**: JWT-based login, register, and logout system
- **Role-Based Access**: Supports Student, Teacher, and Admin roles
- **Course Management**: Dashboard for listing and managing courses
- **Protected Routes**: Private routes for authenticated users only
- **Docker Ready**: Fully containerized with Docker Compose
- **Production-Ready**: nginx configuration for frontend serving

## 📁 Project Structure

```
docker-project/
├── backend/
│   ├── Dockerfile          # Node.js backend container
│   └── (authentication routes)
├── frontend/
│   ├── Dockerfile          # React frontend with nginx
│   ├── nginx.conf          # nginx configuration
│   ├── public/             # Static files
│   ├── src/                # React components
│   │   ├── App.js          # Main app component
│   │   ├── components/     # Login, Dashboard, PrivateRoute
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
├── database/
│   └── schema.sql          # PostgreSQL database schema
├── docker-compose.yml      # Docker orchestration
└── .gitignore              # Git ignore rules
```

## 🔧 Prerequisites

Before running this project, ensure you have:

- **Docker** (tested with Docker Engine 24.0+)
- **Node.js** 18+ (for local development)
- **npm** or **yarn**
- **PostgreSQL** 15+ (or use Docker Compose)
- **Git**

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd docker-project
```

### 2. Environment Variables

Create `.env` files for each service:

**Backend (`.env`)**:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/studentdb
```

**Frontend (`.env`)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Using Docker Compose (recommended):
```bash
docker-compose up -d db
```

Or manually:
```bash
docker run --name studentdb -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Then import the schema:
```bash
psql -h localhost -U postgres -d postgres -f database/schema.sql
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🐳 Deployment Guide

### Docker Compose Deployment

```bash
# Build and start all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Deploy to Production

1. **Update Environment Variables**:
   - Set strong `JWT_SECRET`
   - Configure production database
   - Set `NODE_ENV=production`

2. **Build Production Images**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

3. **Deploy**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Monitor logs and metrics
- [ ] Configure health checks

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| POST | `/api/auth/logout` | Logout (invalidate token) | Authenticated |
| GET | `/api/auth/me` | Get current user info | Authenticated |

### Protected Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Create new course (Admin only) |
| DELETE | `/api/courses/:id` | Delete course (Admin only) |

### Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Login | Login page with role selection |
| `/dashboard` | Dashboard | Course listing and user info |
| `/profile` | Profile | User profile settings |

## ⚙️ Configuration

### Backend Configuration

**Environment Variables**:
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing key
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

**Database Configuration**:
```javascript
{
  user: 'postgres',
  password: 'your-password',
  host: 'localhost',
  port: 5432,
  database: 'studentdb'
}
```

### Frontend Configuration

**Environment Variables**:
- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_TITLE` - Application title
- `REACT_APP_VERSION` - Application version

### Docker Compose Services

| Service | Container Name | Port | Description |
|---------|----------------|------|-------------|
| backend | student-backend | 5000 | Node.js API server |
| frontend | student-frontend | 3000 | React application |
| nginx | student-nginx | 80 | nginx reverse proxy |
| db | studentdb | 5432 | PostgreSQL database |

## 🏗️ Build Instructions

### Backend Build

```bash
cd backend

# Development
npm install
npm run dev

# Production
npm install --production
npm start
```

### Frontend Build

```bash
cd frontend

# Development
npm install
npm run dev

# Production Build
npm run build

# Copy to nginx public directory
cp -r build/* ../public/
```

### Docker Build

```bash
# Build backend image
docker-compose build backend

# Build frontend image
docker-compose build frontend

# Build all images
docker-compose build --parallel
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend won't start

**Symptoms**: Backend container exits immediately

**Solutions**:
```bash
# Check logs
docker-compose logs backend

# Rebuild with fresh node_modules
cd backend
rm -rf node_modules
npm install
npm run dev

# Check for syntax errors in code
```

#### 2. Frontend can't connect to backend

**Symptoms**: CORS errors in browser console

**Solutions**:
```bash
# Update frontend .env
echo "REACT_APP_API_URL=http://localhost:5000/api" >> frontend/.env

# Or rebuild frontend with correct API URL
docker-compose build frontend
```

#### 3. Database connection errors

**Symptoms**: Backend can't connect to PostgreSQL

**Solutions**:
```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart db

# Or recreate database
docker-compose down
docker-compose up -d db

# Import schema
psql -h localhost -U postgres -d postgres -f database/schema.sql
```

#### 4. JWT authentication errors

**Symptoms**: Users can't login, token validation fails

**Solutions**:
```bash
# Regenerate JWT_SECRET
echo "JWT_SECRET=new-secret-key" >> backend/.env

# Restart backend
docker-compose restart backend
```

#### 5. Frontend build fails

**Symptoms**: npm run build shows errors

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors if using TS
# Run linter
npm run lint

# Check for dependency conflicts
npm outdated
```

#### 6. Docker Compose won't start

**Symptoms**: docker-compose up fails

**Solutions**:
```bash
# Check Docker is running
docker ps

# Remove and recreate containers
docker-compose down
docker-compose up -d --build

# Check for port conflicts
netstat -tlnp | grep :3000
netstat -tlnp | grep :5000

# Check Docker volume permissions
docker volume ls
docker volume prune
```

### Development Tips

**View all logs**:
```bash
docker-compose logs -f
```

**Follow specific service logs**:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Stop all services**:
```bash
docker-compose down
```

**Stop with data persistence**:
```bash
docker-compose down -v
```

### Production Monitoring

**Health checks**:
```bash
# Check backend health
curl http://localhost:5000/api/auth/me

# Check frontend health
curl http://localhost:3000

# Check database connectivity
docker exec studentdb psql -U postgres -c "SELECT 1"
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

This project is open-source and available for educational purposes.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Author**: Student Management System Team

README'