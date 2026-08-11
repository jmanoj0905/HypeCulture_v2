# HypeCulture — Codebase Notes

Sneaker reselling marketplace (StockX-style), built as a 4-person team project
(Kobe + 3 others, Manoj on frontend). MVC architecture, graded on: design
models, MVC pattern usage, one design pattern per person, and demo.

## Repo Layout

```
HypeCulture/
├── backend/                  Maven Java (Jakarta EE 6.1 servlets, Java 17)
│   └── src/main/java/com/hypeculture/
│       ├── model/            POJOs: User (+Customer/Seller/Admin), Product,
│       │                     Listing, Cart, CartItem, Order, OrderItem, Category
│       ├── dao/               UserDAO, ProductDAO, ListingDAO, CartDAO,
│       │                     CategoryDAO, OrderDAO (raw JDBC, parameterized SQL)
│       ├── servlet/          AuthServlet, ProductServlet, ListingServlet,
│       │                     CartServlet, OrderServlet, AdminServlet,
│       │                     CategoryServlet, SellerServlet, ImageServlet
│       ├── filter/           CorsFilter, AuthFilter (both mapped to /api/*)
│       └── util/             DBConnection, JsonUtil (Gson), SessionManager
├── frontend/                 React 19 + Vite 8 + TS + Tailwind v4 + Router v7
│   └── src/
│       ├── api/               Axios modules (one per resource, withCredentials)
│       ├── pages/{public,customer,seller,admin,test}/
│       ├── layouts/           RootLayout, PublicLayout, CustomerLayout,
│       │                     SellerLayout, AdminLayout, AuthGuard
│       ├── components/        cards/, cart/, cursor/, effects/, interactive/,
│       │                     navigation/, sections/, system/, typography/, ui/
│       ├── context/           AuthContext, CartContext, TransitionContext
│       ├── observer/          Subject.ts — pub/sub for auth + cart state
│       ├── strategies/        SortStrategy + PriceAscending/Descending/NewestFirst
│       ├── states/            CheckoutState machine (Shipping→Payment→Review→Confirmation)
│       ├── three/             ProductViewer, SneakerModel, SneakerScene (R3F/glTF)
│       └── hooks/             useAuth, useCart, useDepthMap, usePageTransition, etc.
├── database/                  schema.sql, stored-procedures.sql, triggers.sql, seed-data.sql
├── docker-compose.yml         db (mysql:8.4) + backend (Jetty/Tomcat, :8080) + frontend (nginx, :5173→80)
├── docs/project-spec.md       Original assignment spec — source of truth for use cases
├── team/                      Per-person MVC-layer + design-pattern assignments (see below)
└── design-extract-output/     Scraped design tokens/screenshots from landonorris.com (visual reference only, not app code)
```

## Team Assignment (from `team/*.md`)

| Person | MVC Layer | Owns | Design Pattern |
|--------|-----------|------|-----------------|
| 1 | Model | `database/*.sql`, `model/`, `dao/` | DAO |
| 2 | Controller | `servlet/`, `filter/`, `util/` | Factory (service layer) |
| 3 | View (Customer) | Customer-facing pages, AuthContext, customer API modules | React Hooks + Context |
| 4 | View (Seller/Admin) | Seller/Admin pages, shared UI components (Button/Card/Input/Layout) | Compound Components |

Use cases UC-01–UC-07 (login, browse, view sellers, cart, checkout, order
history) are Person 3's; UC-08–UC-14 (listings, inventory, admin user/product/
catalog/reports management) are Person 4's.

Note: the actual frontend has since evolved well beyond the `team/` docs —
pages are `.tsx` not `.jsx`, and it uses hooks/observer/strategy/state patterns
concurrently (see below), not just Context and compound components.

## Design Patterns Actually Implemented (frontend)

- **DAO** (`backend/dao/`) — one DAO class per entity, parameterized SQL only.
- **Observer** (`frontend/src/observer/Subject.ts`) — `AuthSubject`/`CartSubject`
  singletons; components subscribe instead of polling. Explicitly annotated
  with GRASP Low Coupling / Indirection rationale in the source comments.
- **Strategy** (`frontend/src/strategies/`) — `SortStrategy` interface with
  `PriceAscending`, `PriceDescending`, `NewestFirst` implementations, selected
  by id via `getSortStrategy`/`applySortStrategy`.
- **State** (`frontend/src/states/`) — checkout flow modeled as
  `ShippingStep → PaymentStep → ReviewStep → ConfirmationStep`.
- Backend controller layer is plain servlets + filters (Factory pattern intent
  per `team/person2-controller.md`, not yet visibly a formal factory class as
  of the files read).

## Backend Architecture

- **Java 17**, Jakarta Servlet API 6.1 (`provided`, runs on Tomcat 11 /
  Jetty 12 in dev via `jetty-ee10-maven-plugin`, context path `/hypeculture`).
- **Gson** for JSON, **mysql-connector-j 8.3.0** for JDBC, **jBCrypt** for
  password hashing.
- `DBConnection` is a static utility (not a real pool) — opens a fresh JDBC
  connection per call via `DriverManager`, reads `DB_URL`/`DB_USER`/
  `DB_PASSWORD` from env vars with local-dev defaults, never hardcodes creds.
- `web.xml` wires two filters over `/api/*`: `CorsFilter` (locked to
  `http://localhost:5173`, must run before auth so preflight OPTIONS pass) and
  `AuthFilter` (protects everything except `/api/auth/*`). Session cookie is
  `JSESSIONID`, `HttpOnly`, `SameSite=Lax`, 30-minute timeout, `secure=false`
  (dev only — flagged for prod).
- Every servlet maps to a REST-ish `/api/<resource>/*` path; response
  envelope is `{success, data, error}` per CLAUDE.md convention.
- Single-table inheritance: `User` base class covers `Customer`/`Seller`/`Admin`.
- Soft deletes on users/listings to preserve order history integrity.

## Frontend Architecture

- **React 19**, **Vite 8**, **Tailwind v4**, **React Router v7** (data router,
  `createBrowserRouter`), **Axios** (`withCredentials: true`).
- Route tree: `RootLayout` → `PublicLayout` (landing/login/register/browse/
  product detail) sits alongside `CustomerLayout` (cart/checkout/orders),
  `SellerLayout` (`/seller/*`), `AdminLayout` (`/admin/*`) — each role gets
  its own layout shell.
- Heavy motion/interaction layer inspired by the Lando Norris site (see
  CLAUDE.md "Frontend Techniques"): GSAP, Lenis smooth scroll, React Three
  Fiber + drei for 3D sneaker viewers (`.glb` models in `public/models/`),
  custom cursor/parallax/tilt/drag-gallery interactive components, and a
  library of typography reveal effects (`SplitText`, `GlitchText`,
  `ScrambleText`, `DecryptedText`, etc.).
- `design-extract-output/` holds scraped tokens/screenshots from
  landonorris.com used purely as a visual reference for the above — not
  imported by the app.

## Database & Infra

- MySQL 8 schema + stored procedures + triggers + seed data, applied via
  `mysql -u root -p < database/*.sql` or automatically through
  `docker/mysql/init/00-init.sh` in the Docker Compose flow.
- `docker-compose.yml` brings up `db` (mysql:8.4, healthchecked), `backend`
  (built from `backend/Dockerfile`, env-configured DB creds, :8080), and
  `frontend` (nginx serving the Vite build, :5173→80 in-container).
- Default seeded accounts (all password `password123`): customer
  `jordan@example.com`, seller `kicks@vault.com`, admin `admin@hypeculture.com`.

## Loose Ends / Things to Watch

- `backend/target/classes/**` (compiled `.class` files) is checked into git
  and shows up as modified/deleted in `git status` — likely should be
  gitignored rather than committed per-build.
- Root-level `cookies.txt`, `fix-images.sql`, `fix-passwords.sql`,
  `show-browser-url.sh` look like ad-hoc debugging artifacts, not part of the
  documented build/run flow.
- `frontend/src/pages/test/TestPage.tsx` and `components/test/TestFetch.tsx`
  are scratch/dev-only routes still wired into `router.tsx` (`/test`).
