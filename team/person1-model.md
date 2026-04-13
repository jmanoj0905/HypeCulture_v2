# Person 1 — Model Layer

**MVC Role**: Model (Database + POJOs + DAOs)

**Design Pattern**: DAO (Data Access Object)

---

## What You Own

### Database
- `database/schema.sql` — Tables: Users, Products, Categories, Listings, Cart, Orders, OrderItems
- `database/stored-procedures.sql` — SPs for: Login, CreateOrder, UpdateInventory
- `database/triggers.sql` — Triggers for: auto-delete cart on checkout, order timestamp
- `database/seed-data.sql` — Sample data

### Backend: Model Package (`com.hypeculture.model`)
- `User.java` — User/Customer/seller/admin POJOs
- `Product.java` — Product catalog POJO
- `Listing.java` — Seller listing POJO (links Product to Seller + price/stock)
- `CartItem.java` — Cart item POJO
- `Order.java` / `OrderItem.java` — Order POJOs

### Backend: DAO Package (`com.hypeculture.dao`)
- `UserDAO.java` — CRUD + authenticate, get by role
- `ProductDAO.java` — Browse by category, sort by price
- `ListingDAO.java` — Get listings by product, by seller
- `CartDAO.java` — Add/remove/get cart items
- `OrderDAO.java` — Create order, get order history

---

## Marks You're Responsible For

| Criteria | Description |
|----------|-------------|
| Design models | Your database schema + POJOs represent the domain model |
| Design patterns | DAO pattern — each DAO handles one entity, decouples business logic from DB |

---

## Key Deliverables

1. Complete MySQL schema with foreign keys and indexes
2. Working stored procedures and triggers
3. POJO classes matching every table
4. DAO classes with parameterized queries (no string concat!)

---

## Dependencies

- Servlets (Person 2) call your DAOs
- React frontend (Persons 3-4) receives JSON from your model layer via servlets