# Person 3 — View Layer (Customer)

**MVC Role**: View (Customer-facing React pages)

**Design Pattern**: React Hooks + Context

---

## What You Own

### Frontend: Pages
- `pages/Login.jsx` — Login form
- `pages/CustomerBrowse.jsx` — Browse products by category, sort by price
- `pages/CustomerProduct.jsx` — View sellers for a product, select seller
- `pages/Cart.jsx` — View cart, remove items
- `pages/Checkout.jsx` — Shipping + payment form
- `pages/CustomerOrders.jsx` — Order history

### Frontend: Context
- `context/AuthContext.jsx` — Store user session, role check

### Frontend: API
- `api/auth.js` — Login/logout axios calls
- `api/products.js` — Browse/get products axios calls
- `api/cart.js` — Cart axios calls

---

## Marks You're Responsible For

| Criteria | Description |
|----------|-------------|
| Design patterns | React Hooks (useState, useEffect, custom hooks) + Context for state management |

---

## Key Deliverables

1. Login page that stores session
2. Product browsing with category filter + price sort
3. Shopping cart with add/remove functionality
4. Checkout flow with shipping
5. Order history view

---

## Use Cases You Cover

| UC ID | Use Case |
|-------|----------|
| UC-01 | Login |
| UC-02 | Browse Shoes by Category |
| UC-03 | View Sellers for a Shoe |
| UC-04 | Add Item to Cart |
| UC-05 | View Shopping Cart |
| UC-06 | Checkout |
| UC-07 | View Order History |

---

## Dependencies

- Servlets (Person 2) — your API calls go to their endpoints
- Person 4 — you share UI components (Button, Card, Input)