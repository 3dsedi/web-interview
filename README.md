# Todo App - Docker Setup & Recruitment Demo

A full-stack Todo application with React frontend and Node.js backend, containerized with Docker for easy setup and demonstration.

## Quick Start with Docker 🚀

### Prerequisites
- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Run the Application
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

> **Note**: The application uses Node.js 20 in Docker containers to support the better-sqlite3 dependency. If you encounter build errors, try cleaning Docker cache first

### Access the Application
- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3001/

### Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (this will delete the database)
docker-compose down -v

# To reset the database manually, delete the data directory:
# rm -rf backend/data
```

## Features

### Database Persistence
- Uses SQLite database (`backend/data/todos.db`)
- Data persists between container restarts
- Database directory is mounted as a volume
- Database file is automatically created on first run



