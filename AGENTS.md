# HypeCulture — Agent Instructions

## Running the Project

```bash
# 1. MySQL must be running with hypeculture_db created
#    See SETUP.md for full initialization commands

# 2. Backend (Jetty on port 8080)
cd backend
DB_USER=hypeculture DB_PASSWORD=hypeculture123 mvn jetty:run

# 3. Frontend (Vite on port 5173) - separate terminal
cd frontend
npm install  # first time only
npm run dev
```

## Tech Stack

- **Backend**: Java 17, Jakarta EE (Servlet 6.1), Jetty 12, MySQL 8, Gson, jBCrypt
- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS 4, GSAP, Three.js
- **Database**: MySQL 8 (schema + seed data + stored procedures + triggers in `database/`)

## Key Commands

| Component | Command |
|-----------|---------|
| Backend build | `mvn clean package` |
| Backend run | `mvn jetty:run` (requires DB env vars) |
| Frontend build | `npm run build` |
| Frontend dev | `npm run dev` |
| Frontend lint | `npm run lint` |

## Test Accounts (password: `password123`)

- Admin: `admin@hypeculture.com`
- Seller: `kicks@vault.com`
- Customer: `jordan@example.com`

## Project Structure

```
HypeCulture_v2/
├── backend/        # Java servlet backend (Jakarta EE + Jetty)
├── frontend/      # React + Vite frontend
├── database/      # SQL schema, seed data, stored procedures, triggers
├── docs/           # Project specification
└── team/          # Role-based feature assignments
```

## Important Notes

- Backend context path: `/hypeculture` (access at `http://localhost:8080/hypeculture`)
- Database must be initialized before running backend (see SETUP.md steps 1-2)
- Frontend API calls proxy to backend; ensure both run concurrently
- Tailwind CSS v4 uses `@import "tailwindcss"` in CSS (not `@tailwind` directives)