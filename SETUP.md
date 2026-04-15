# HypeCulture — Setup Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Java JDK | 17+ | `sudo apt install openjdk-17-jdk` |
| Maven | 3.8+ | `sudo apt install maven` |
| Node.js | 18+ | `sudo apt install nodejs` |
| npm | 9+ | `sudo apt install npm` |
| MySQL | 8.0+ | `sudo apt install mysql-server` |

---

## 1. MySQL Setup

```bash
# Start MySQL
sudo systemctl start mysql

# Create DB and user
sudo mysql -e "CREATE DATABASE IF NOT EXISTS hypeculture_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'hypeculture'@'localhost' IDENTIFIED BY 'hypeculture123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON hypeculture_db.* TO 'hypeculture'@'localhost'; FLUSH PRIVILEGES;"

# Load schema and data
sudo mysql hypeculture_db < database/schema.sql
sudo mysql hypeculture_db < database/seed-data.sql
sudo mysql hypeculture_db < database/stored-procedures.sql
sudo mysql hypeculture_db < database/triggers.sql
```

> Duplicate entry warnings on `seed-data.sql` are safe to ignore if you've run it before.

---

## 2. Backend

```bash
cd backend
DB_USER=hypeculture DB_PASSWORD=hypeculture123 mvn jetty:run
```

Runs at: `http://localhost:8080/hypeculture`

---

## 3. Frontend

Open a **new terminal**:

```bash
cd frontend
npm install       # first time only
npm run dev
```

Runs at: `http://localhost:5173`

---

## Test Accounts

All accounts use the password: **`password123`**

| Role | Email |
|------|-------|
| Admin | `admin@hypeculture.com` |
| Seller | `kicks@vault.com` |
| Customer | `jordan@example.com` |

---

## Project Structure

```
HypeCulture_v2/
├── backend/        # Java servlet backend (Jakarta EE + Jetty)
├── frontend/       # React + Vite frontend
├── database/       # SQL schema, seed data, procedures, triggers
└── docs/           # Additional documentation
```
