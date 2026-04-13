# Person 4 — View Layer (Seller + Admin)

**MVC Role**: View (Seller/Admin React pages + Shared components)

**Design Pattern**: Compound Components

---

## What You Own

### Frontend: Shared Components
- `components/Layout.jsx` — Sidebar + main content wrapper
- `components/Sidebar.jsx` — Navigation menu
- `components/Button.jsx`, `Card.jsx`, `Input.jsx` — Reusable UI

### Frontend: Seller Pages
- `pages/SellerDashboard.jsx` — Overview
- `pages/SellerListings.jsx` — View current listings
- `pages/SellerAddListing.jsx` — Add new listing (validate against catalog)
- `pages/SellerEditListing.jsx` — Update price/stock, remove listing

### Frontend: Admin Pages
- `pages/AdminDashboard.jsx` — Overview
- `pages/AdminUsers.jsx` — View all users, add/remove users
- `pages/AdminProducts.jsx` — View all products, add to catalog
- `pages/AdminReports.jsx` — Generate reports, view all orders

---

## Marks You're Responsible For

| Criteria | Description |
|----------|-------------|
| Design patterns | Compound Components — reusable UI components that work together |

---

## Key Deliverables

1. Layout with sidebar for Seller/Admin views
2. Shared UI components (Button, Card, Input, Layout)
3. Seller listing management (add/edit/remove)
4. Admin user management (add/remove)
5. Admin product catalog management
6. Admin reports generation

---

## Use Cases You Cover

| UC ID | Use Case |
|-------|----------|
| UC-08 | Add New Listing |
| UC-09 | Manage Inventory |
| UC-10 | View All Users |
| UC-11 | View All Products |
| UC-12 | Manage Product Catalog |
| UC-13 | Manage Users |
| UC-14 | Generate Database Reports |

---

## Dependencies

- Servlets (Person 2) — your API calls go to their endpoints
- Person 3 — you share UI components