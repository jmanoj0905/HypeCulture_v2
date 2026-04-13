# Person 2 — Controller Layer

**MVC Role**: Controller (Backend Servlets + Filters)

**Design Pattern**: Factory Pattern (Service Layer)

---

## What You Own

### Backend: Servlet Package (`com.hypeculture.servlet`)
- `AuthServlet.java` — /api/auth/login, /api/auth/logout
- `ProductServlet.java` — /api/products (GET by category, sort)
- `ListingServlet.java` — /api/listings (GET by product, by seller)
- `CartServlet.java` — /api/cart (GET, POST add, DELETE remove)
- `OrderServlet.java` — /api/orders (POST checkout, GET history)
- `AdminServlet.java` — /api/admin/users, /api/admin/products

### Backend: Filter Package (`com.hypeculture.filter`)
- `AuthFilter.java` — Protects servlet endpoints, checks session
- `CorsFilter.java` — Handles cross-origin requests

### Backend: Util Package (`com.hypeculture.util`)
- `DBConnection.java` — Database connection pool
- `JsonUtil.java` — Gson JSON serialization
- `SessionManager.java` — Session handling

---

## Marks You're Responsible For

| Criteria | Description |
|----------|-------------|
| MVC Controller | Your Servlets handle all HTTP requests, call DAOs, return JSON responses |

---

## Key Deliverables

1. RESTful API endpoints for all 14 use cases
2. JSON response envelope: `{success: bool, data: ..., error: ...}`
3. Session-based auth (JSESSIONID cookie)
4. CORS + Auth filters working

---

## Dependencies

- DAOs (Person 1) — you call their DAO methods
- React frontend (Persons 3-4) — sends requests to your servlets