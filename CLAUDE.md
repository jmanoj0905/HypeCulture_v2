# HYPECULTURE

I'm Kobe. Sneaker marketplace, let's build.

## What This Is

Sneaker reselling marketplace (StockX-style). Three roles: Customer, Seller, Admin. Full-stack from scratch.

## Team & Grading

Team project (4 people). Manoj handles frontend + other work.

| Criteria | Marks |
|----------|-------|
| Analysis and design models | 2 |
| Use of MVC architecture pattern | 2 |
| Design principles and patterns (1 per person) | 3 |
| Presentation/demo | 3 |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS v4 + React Router v7 + Axios |
| Backend | Java Servlets (Jakarta EE 6.1) + JDBC + Gson |
| Database | MySQL 8.0+ |
| Build | Maven (backend WAR) + npm/Vite (frontend) |
| Server | Apache Tomcat 11 |

## Project Structure

```
HypeCulture/
├── database/       # SQL: schema, stored procedures, triggers, seed data
├── backend/        # Maven Java project (com.hypeculture)
│   └── src/main/java/com/hypeculture/
│       ├── model/      # POJOs
│       ├── dao/        # Data access objects
│       ├── servlet/    # REST API servlets
│       ├── filter/     # AuthFilter, CorsFilter
│       └── util/       # DBConnection, SessionManager, PasswordUtil, JsonUtil
├── frontend/       # React + Vite SPA
│   └── src/
│       ├── api/        # Axios modules
│       ├── context/    # AuthContext
│       ├── components/ # Reusable UI components
│       └── pages/      # Route-level page components
└── docs/           # Original project spec (project-spec.md)
```

## Conventions

- Backend returns JSON with `{success: bool, data: ..., error: ...}` envelope on all endpoints
- Session-based auth via JSESSIONID cookie (not JWT)
- Axios uses `withCredentials: true` for cookie transport
- Vite proxies `/api` to `http://localhost:8080/hypeculture` during dev
- All API routes under `/api/` prefix
- Soft deletes on users and listings (preserve order history)
- Single-table inheritance for User/Customer/Seller/Admin

## Build & Run

```bash
# Database
mysql -u root -p < database/schema.sql
mysql -u root -p hypeculture_db < database/stored-procedures.sql
mysql -u root -p hypeculture_db < database/triggers.sql
mysql -u root -p hypeculture_db < database/seed-data.sql

# Backend
cd backend && mvn clean package
# Deploy target/hypeculture.war to Tomcat webapps/

# Frontend
cd frontend && npm install && npm run dev
# Opens at http://localhost:5173
```

## UI Design

- Dark theme: slate-900 base, emerald-500 primary, amber-400 prices
- Customer pages: centered full-width layout
- Seller/Admin pages: sidebar + main content
- Tailwind utility classes only -- no custom CSS unless unavoidable

## Frontend Techniques (Lando Norris site inspiration)

Reference video: https://www.youtube.com/watch?v=HzL65tTeANs

### 3D Product Viewer (Three.js)
- Sneaker 3D models via glTF files with texture maps (base color, roughness, metallic, normal)
- Depth maps on product images for subtle parallax on cursor move
- Scroll-driven 3D model rotation (real 3D, not pre-rendered video)

### Scroll & Page Transitions
- Lenis library for smooth scroll (natural feel, keyboard/search still work)
- Page transition curtain effect: loader screen up, swap content behind, mask-out reveal
- Scroll-triggered animations via inline style updates

### CSS Effects
- CSS `mask-image` with SVG for non-standard div shapes on product cards
- `clip-path: ellipse()` for hover reveal animations
- Text hover effect: each letter in `<span>`, staggered `transition-delay`, `transform: translateY(-100%)`

### Performance Rules (non-negotiable)
- Zero drop shadows -- flat design only
- Minimal filters, blur, gradients
- All animations via `transform` and `opacity` only -- never animate top/left/width/font-size
- Avoid excessive `position: absolute`
- Target: no dropped frames on scroll

## Rules

- Original project spec lives at `docs/project-spec.md` -- reference for use case details
- Plan file has the full implementation roadmap with all 8 phases
- Never hardcode DB credentials -- use environment variables or config file
- Parameterized SQL queries only -- no string concatenation
