# HYPECULTURE — Shoe Reselling Marketplace

## Complete Project Documentation

---

## 1. Project Overview

HYPECULTURE is a full-featured Java web application that simulates an end-to-end sneaker marketplace. Inspired by platforms like StockX and Amazon, it lets customers, sellers, and admins interact seamlessly — browsing, selling, and managing shoe inventory through a structured MVC interface.

### 1.1 Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java |
| Frontend | JSP (JavaServer Pages) |
| Backend | Servlets, JDBC |
| Database | MySQL |
| Architecture | MVC (Model-View-Controller) |
| Build | Standard Java EE Web Application |

### 1.2 System Actors

| Actor | Description |
|-------|-------------|
| Customer | Browses shoes, adds to cart, places orders, views order history |
| Seller | Lists shoes for sale, manages inventory (price, stock, removal) |
| Admin | Manages users, product catalog, generates reports, views all orders |

### 1.3 Key Features

- Category-based shoe browsing with price sorting
- Multi-seller marketplace (multiple sellers per shoe model)
- Shopping cart with add/remove functionality
- Full checkout flow with shipping and payment
- Order processing via stored procedures and database triggers
- Seller listing management with catalog validation
- Admin user management (add/remove customers and sellers)
- Admin product catalog management
- Database report generation with optional order drill-down
- Role-based access control via session management

---

## 2. Use Case Specifications

### 2.1 Use Case Summary

| UC ID | Use Case Name | Actor(s) | Relationships |
|-------|--------------|----------|---------------|
| UC-01 | Login | Customer, Seller, Admin | `<<include>>` Authenticate Credentials, Maintain Session |
| UC-02 | Browse Shoes by Category | Customer | `<<include>>` Sort by Cheapest Price |
| UC-03 | View Sellers for a Shoe | Customer | — |
| UC-04 | Add Item to Cart | Customer | — |
| UC-05 | View Shopping Cart | Customer | `<<extend>>` Remove Items from Cart |
| UC-06 | Checkout | Customer | `<<include>>` Provide Shipping Details, Process Order |
| UC-07 | View Order History | Customer | — |
| UC-08 | Add New Listing | Seller | `<<include>>` Validate Product in Catalog |
| UC-09 | Manage Inventory | Seller | `<<include>>` View Current Listings, Update Listing, Remove Listing |
| UC-10 | View All Users | Admin | — |
| UC-11 | View All Products | Admin | — |
| UC-12 | Manage Product Catalog | Admin | `<<include>>` Add New Product to Catalog |
| UC-13 | Manage Users | Admin | `<<include>>` Add New User, Remove User |
| UC-14 | Generate Database Reports | Admin | `<<extend>>` View All Orders |

---

### 2.2 Detailed Use Case Specifications

#### UC-01: Login

| Field | Details |
|-------|---------|
| Use Case ID | UC-01 |
| Use Case Name | Login |
| Actor(s) | Customer, Seller, Admin |
| Description | Allows users to authenticate into the HYPECULTURE system and access their role-based dashboard |
| Preconditions | User has a registered account; system is accessible |
| Postconditions | User is authenticated, session is created, and user is redirected to their role-based dashboard |

**Relationships:**

- `<<include>>` Authenticate Credentials — System validates the entered username/password against stored records
- `<<include>>` Maintain Session — System generates and maintains a session token (HttpSession) for the authenticated user

**Main Flow:**

1. User opens the HYPECULTURE application
2. System displays the Login page
3. User enters username/email and password
4. System authenticates credentials against the database (`<<include>>` Authenticate Credentials)
5. System creates a session and stores user role and ID (`<<include>>` Maintain Session)
6. System redirects user to their role-based dashboard (Customer / Seller / Admin)

**Alternative Flows:**

- A1: Invalid credentials — System displays "Invalid username or password", allows retry (max 5 attempts)
- A2: Account locked after repeated failures — System notifies user with unlock/reset instructions
- A3: Session already active — System redirects to existing dashboard

**Exceptions:**

- E1: Database connection failure — Display service unavailable message
- E2: Session creation failure — Log error and prompt user to retry

---

#### UC-02: Browse Shoes by Category

| Field | Details |
|-------|---------|
| Use Case ID | UC-02 |
| Use Case Name | Browse Shoes by Category |
| Actor(s) | Customer |
| Description | Customer browses the shoe catalog filtered by category (Sneakers, Boots, Running, etc.) |
| Preconditions | Customer is logged in; shoe listings exist in the database |
| Postconditions | Customer views a filtered list of shoes in the selected category |

**Relationships:**

- `<<include>>` Sort by Cheapest Price — Results are sortable by price ascending to help customers find the best deals

**Main Flow:**

1. Customer navigates to the marketplace homepage
2. System displays available shoe categories (Sneakers, Boots, Running, Casual, etc.)
3. Customer selects a category
4. System queries the database for all active listings in that category
5. System displays results with: shoe name, brand, thumbnail image, price, and condition
6. Customer applies sorting via "Sort by Cheapest Price" (`<<include>>` Sort by Cheapest Price)
7. System reorders results by price in ascending order
8. Customer can paginate through results

**Alternative Flows:**

- A1: No listings in selected category — System displays "No shoes found in this category"
- A2: Customer switches category — System refreshes results for new selection

**Exceptions:**

- E1: Database query timeout — Display error and suggest retry

---

#### UC-03: View Sellers for a Shoe

| Field | Details |
|-------|---------|
| Use Case ID | UC-03 |
| Use Case Name | View Sellers for a Shoe |
| Actor(s) | Customer |
| Description | Customer views all sellers offering a specific shoe model, comparing prices and seller ratings |
| Preconditions | Customer is logged in; customer has selected a shoe from the catalog |
| Postconditions | Customer sees a list of sellers for the selected shoe with pricing and seller details |

**Main Flow:**

1. Customer clicks on a shoe listing from the browse/search results
2. System retrieves all active sellers offering this shoe model from the database
3. System displays: seller name, asking price, shoe condition (New/Used), size, seller rating
4. Results are sorted by price (lowest first) by default
5. Customer can compare sellers side-by-side
6. Customer selects a seller's offer to proceed to purchase

**Alternative Flows:**

- A1: Only one seller exists — System displays single seller details directly
- A2: A seller's listing becomes unavailable — System removes it from the view in real-time

**Exceptions:**

- E1: Shoe model no longer exists in catalog — Display "This shoe is no longer available"

---

#### UC-04: Add Item to Cart

| Field | Details |
|-------|---------|
| Use Case ID | UC-04 |
| Use Case Name | Add Item to Cart |
| Actor(s) | Customer |
| Description | Customer adds a selected shoe from a specific seller to their shopping cart |
| Preconditions | Customer is logged in; selected listing is active and in stock |
| Postconditions | Item is added to the customer's cart; cart total is updated |

**Main Flow:**

1. Customer selects a shoe offer from a seller (via Browse or View Sellers)
2. Customer selects desired size and quantity
3. Customer clicks "Add to Cart"
4. System checks real-time stock availability
5. System inserts item into the cart table linked to the customer's session
6. System updates the cart item count and subtotal
7. System displays confirmation: "Item added to cart"

**Alternative Flows:**

- A1: Item already in cart — System increments quantity and notifies customer
- A2: Item out of stock — System displays "This item is currently unavailable"

**Exceptions:**

- E1: Session expired — Redirect to login; cart state is lost
- E2: Concurrent stock depletion — Notify customer item is no longer available

---

#### UC-05: View Shopping Cart

| Field | Details |
|-------|---------|
| Use Case ID | UC-05 |
| Use Case Name | View Shopping Cart |
| Actor(s) | Customer |
| Description | Customer views all items currently in their shopping cart with prices, quantities, and subtotal |
| Preconditions | Customer is logged in |
| Postconditions | Customer sees current cart contents and can proceed to checkout or modify cart |

**Relationships:**

- `<<extend>>` Remove Items from Cart — Customer may optionally remove items from the cart while viewing it

**Main Flow:**

1. Customer clicks "View Cart" / navigates to the shopping cart page
2. System queries the cart table for all items linked to the customer
3. System displays: shoe name, seller, size, quantity, unit price, line total
4. System calculates and displays cart subtotal
5. Customer can update quantities for any item
6. Customer can proceed to Checkout

**Extension Flow (Remove Items from Cart):**

1. Customer clicks "Remove" next to an item in the cart
2. System deletes the item from the cart table
3. System recalculates subtotal
4. System displays updated cart (`<<extend>>` Remove Items from Cart)

**Alternative Flows:**

- A1: Cart is empty — System displays "Your cart is empty" with link to browse shoes
- A2: Item in cart is no longer available — System flags item and suggests removal

**Exceptions:**

- E1: Price changed since item was added — System updates price and notifies customer

---

#### UC-06: Checkout

| Field | Details |
|-------|---------|
| Use Case ID | UC-06 |
| Use Case Name | Checkout |
| Actor(s) | Customer |
| Description | Customer completes the purchase by providing shipping details and confirming the order |
| Preconditions | Customer is logged in; cart contains at least one item; all items are in stock |
| Postconditions | Order is created; inventory is decremented; cart is cleared; confirmation is generated |

**Relationships:**

- `<<include>>` Provide Shipping Details — Customer must enter a valid shipping address before order can be placed
- `<<include>>` Process Order — System creates the order record, decrements inventory, and generates order confirmation

**Main Flow:**

1. Customer clicks "Proceed to Checkout" from the cart
2. System displays order summary: items, quantities, prices, subtotal
3. Customer enters shipping address, city, state, zip code (`<<include>>` Provide Shipping Details)
4. Customer selects payment method (Credit Card, UPI, Cash on Delivery)
5. System calculates total including taxes and shipping fees
6. Customer reviews final summary and clicks "Place Order"
7. System validates stock availability one final time
8. System creates order record with unique Order ID via stored procedure (`<<include>>` Process Order)
9. System decrements stock quantities using database trigger
10. System clears the customer's cart
11. System displays order confirmation with Order ID and estimated delivery

**Alternative Flows:**

- A1: Payment validation fails — System displays error; order is not created
- A2: Item goes out of stock during checkout — Notify customer and remove item
- A3: Invalid shipping address — System prompts customer to correct the address

**Exceptions:**

- E1: Database transaction failure — Rollback order and notify customer
- E2: Session timeout during checkout — Redirect to login; cart is preserved

---

#### UC-07: View Order History

| Field | Details |
|-------|---------|
| Use Case ID | UC-07 |
| Use Case Name | View Order History |
| Actor(s) | Customer |
| Description | Customer views a list of all their past and current orders with status and details |
| Preconditions | Customer is logged in |
| Postconditions | Customer sees a chronological list of all their orders |

**Main Flow:**

1. Customer navigates to "My Orders" / "Order History"
2. System queries the orders table filtered by the customer's ID
3. System displays orders in reverse chronological order
4. Each order shows: Order ID, date, items summary, total amount, status (Placed / Shipped / Delivered / Cancelled)
5. Customer clicks an order to view full details: items, quantities, shipping address, payment method
6. Customer can track active orders or view completed order receipts

**Alternative Flows:**

- A1: No orders exist — System displays "You have no orders yet" with link to browse

**Exceptions:**

- E1: Order data retrieval failure — Display error and suggest retry

---

#### UC-08: Add New Listing

| Field | Details |
|-------|---------|
| Use Case ID | UC-08 |
| Use Case Name | Add New Listing |
| Actor(s) | Seller |
| Description | Seller creates a new shoe listing by selecting a product from the catalog and setting price, size, condition, and stock |
| Preconditions | Seller is logged in; product exists in the system catalog |
| Postconditions | New listing is created and visible to customers in the marketplace |

**Relationships:**

- `<<include>>` Validate Product in Catalog — System verifies the shoe model exists in the master product catalog before the listing is created

**Main Flow:**

1. Seller navigates to "My Listings" and clicks "Add New Listing"
2. Seller searches for or selects a shoe model from the product catalog
3. System validates that the product exists in the catalog (`<<include>>` Validate Product in Catalog)
4. Seller enters listing details: size, condition (New/Used), asking price, stock quantity
5. Seller adds a description and uploads product images
6. Seller reviews the listing preview
7. Seller clicks "Publish Listing"
8. System validates all required fields
9. System creates the listing record via stored procedure and assigns a Listing ID
10. Listing becomes active and visible to customers

**Alternative Flows:**

- A1: Product not found in catalog — System displays "Product not in catalog"; seller cannot list
- A2: Required fields missing — System highlights missing fields with validation errors
- A3: Duplicate listing (same product, size, condition) — System warns and suggests editing existing listing

**Exceptions:**

- E1: Image upload failure — Allow retry; listing saved as draft without images
- E2: Seller account suspended — Listing creation blocked with admin contact info

---

#### UC-09: Manage Inventory

| Field | Details |
|-------|---------|
| Use Case ID | UC-09 |
| Use Case Name | Manage Inventory |
| Actor(s) | Seller |
| Description | Seller manages all their active listings: view current listings, update price/stock, or remove listings |
| Preconditions | Seller is logged in; at least one listing exists |
| Postconditions | Listing records are updated or removed in the database |

**Relationships:**

- `<<include>>` View Current Listings — System displays all of the seller's active listings with details
- `<<include>>` Update Listing (Price / Stock) — Seller modifies the price or stock quantity of an existing listing
- `<<include>>` Remove Listing — Seller removes a listing from the marketplace (soft delete)

**Main Flow:**

1. Seller navigates to "Manage Inventory" dashboard
2. System retrieves and displays all seller's listings (`<<include>>` View Current Listings)
3. Each listing shows: shoe name, brand, size, price, stock quantity, status, sales count
4. Seller selects a listing to modify
5. Seller updates price and/or stock quantity (`<<include>>` Update Listing (Price / Stock))
6. System validates new values and updates the database record
7. Changes are reflected in the marketplace immediately

**Flow (Remove Listing):**

1. Seller selects a listing and clicks "Remove Listing"
2. System checks if the listing has active/pending orders
3. If no active orders, system soft-deletes the listing (marks inactive) to preserve order history
4. System confirms removal (`<<include>>` Remove Listing)
5. Listing is no longer visible to customers

**Alternative Flows:**

- A1: Stock updated to 0 — System auto-marks listing as "Sold Out" via database trigger
- A2: Listing has active orders — System prevents removal until orders are fulfilled

**Exceptions:**

- E1: Concurrent order conflicts with stock update — System warns of conflict
- E2: Database update failure — Display retry message; original values preserved

---

#### UC-10: View All Users

| Field | Details |
|-------|---------|
| Use Case ID | UC-10 |
| Use Case Name | View All Users |
| Actor(s) | Admin |
| Description | Admin views a complete list of all registered users (Customers and Sellers) in the system |
| Preconditions | Admin is logged in |
| Postconditions | Admin sees a paginated list of all users with their details and status |

**Main Flow:**

1. Admin navigates to the "View All Users" panel
2. System queries the users table and retrieves all records
3. System displays a paginated list with: User ID, username, email, role, registration date, status (Active/Inactive)
4. Admin can search users by name, email, or role
5. Admin can sort by any column (name, date, role, status)
6. Admin clicks a user row to view full profile details and activity history

**Alternative Flows:**

- A1: No users match search criteria — System displays "No users found"

**Exceptions:**

- E1: Database query failure — Display error and suggest retry

---

#### UC-11: View All Products

| Field | Details |
|-------|---------|
| Use Case ID | UC-11 |
| Use Case Name | View All Products |
| Actor(s) | Admin |
| Description | Admin views the complete product catalog and all active listings across all sellers |
| Preconditions | Admin is logged in |
| Postconditions | Admin sees a comprehensive view of all products and listings in the system |

**Main Flow:**

1. Admin navigates to "View All Products"
2. System retrieves all products from the catalog and all active seller listings
3. System displays: Product ID, shoe name, brand, category, number of active listings, total stock across sellers
4. Admin can filter by category, brand, or stock status
5. Admin can drill down into a product to see all seller listings for that shoe
6. Admin can identify products with no active listings or low stock

**Alternative Flows:**

- A1: No products in catalog — System displays "Product catalog is empty"

**Exceptions:**

- E1: Large dataset query timeout — Display partial results with warning

---

#### UC-12: Manage Product Catalog

| Field | Details |
|-------|---------|
| Use Case ID | UC-12 |
| Use Case Name | Manage Product Catalog |
| Actor(s) | Admin |
| Description | Admin manages the master product catalog by adding new shoe models that sellers can then list |
| Preconditions | Admin is logged in with catalog management privileges |
| Postconditions | Product catalog is updated; new products are available for sellers to list against |

**Relationships:**

- `<<include>>` Add New Product to Catalog — Admin creates a new master product entry (shoe model) in the catalog

**Main Flow:**

1. Admin navigates to "Manage Product Catalog"
2. System displays all products in the master catalog
3. Admin clicks "Add New Product" (`<<include>>` Add New Product to Catalog)
4. Admin enters: shoe name, brand, model, category (Sneakers/Boots/Running/Casual), description
5. Admin uploads a reference image for the product
6. System validates for duplicate entries (same brand + model)
7. System creates the product record and assigns a Product ID
8. New product is now available for sellers to create listings against

**Alternative Flows:**

- A1: Duplicate product detected — System warns "This product already exists in the catalog"
- A2: Admin edits an existing product — System updates catalog entry; active listings are unaffected
- A3: Admin removes a product from catalog — System checks for active listings first

**Exceptions:**

- E1: Product has active seller listings — Cannot remove from catalog until listings are cleared
- E2: Image upload failure — Product saved without image; admin can upload later

---

#### UC-13: Manage Users

| Field | Details |
|-------|---------|
| Use Case ID | UC-13 |
| Use Case Name | Manage Users |
| Actor(s) | Admin |
| Description | Admin adds new user accounts or removes existing users (Customers and Sellers) from the system |
| Preconditions | Admin is logged in with user management privileges |
| Postconditions | User records are created or deactivated; all actions are logged |

**Relationships:**

- `<<include>>` Add New User (Customer / Seller) — Admin manually creates a new Customer or Seller account
- `<<include>>` Remove User (Seller / Customer) — Admin deactivates or removes a user account from the system

**Main Flow (Add New User):**

1. Admin navigates to "Manage Users" and clicks "Add New User"
2. Admin selects role: Customer or Seller (`<<include>>` Add New User)
3. Admin enters: username, email, phone number, password
4. System validates input and checks for duplicate email/username
5. System creates the user account and assigns a User ID
6. System sends account credentials to the new user via email
7. Admin action is logged with timestamp

**Main Flow (Remove User):**

1. Admin searches for and selects a user to remove
2. System checks if the user has active orders or listings
3. System displays a warning with impact summary
4. Admin confirms removal (`<<include>>` Remove User)
5. System deactivates the user account (soft delete to preserve order/transaction history)
6. Removed user can no longer log in; their listings are hidden from the marketplace
7. Admin action is logged with timestamp and reason

**Alternative Flows:**

- A1: User has active orders — System warns admin; orders must be fulfilled or cancelled first
- A2: Seller has active listings — System deactivates all listings upon seller removal
- A3: Admin attempts to remove another admin — System prevents action or requires super-admin approval

**Exceptions:**

- E1: Duplicate email during user creation — Display "Email already registered"
- E2: Attempting to remove the last admin account — System prevents action

---

#### UC-14: Generate Database Reports

| Field | Details |
|-------|---------|
| Use Case ID | UC-14 |
| Use Case Name | Generate Database Reports |
| Actor(s) | Admin |
| Description | Admin generates summarized reports on sales, inventory, users, and marketplace performance using SQL aggregate queries |
| Preconditions | Admin is logged in with reporting privileges |
| Postconditions | Report is generated and displayed; available for export |

**Relationships:**

- `<<extend>>` View All Orders — Admin may optionally drill down into a detailed view of all orders from within the reports section

**Main Flow:**

1. Admin navigates to "Generate Database Reports"
2. Admin selects report type: Sales Summary, Inventory Report, User Activity, Seller Performance
3. Admin sets date range and filters (category, seller, status)
4. System executes complex SQL queries with JOINs, GROUP BY, and aggregate functions
5. System compiles and displays the report with tabular data and summary statistics
6. Admin can export the report as CSV

**Extension Flow (View All Orders):**

1. From within a report, Admin clicks "View All Orders" to drill into detailed order data
2. System retrieves all orders matching the report's filter criteria (`<<extend>>` View All Orders)
3. System displays: Order ID, customer, items, total, status, date, seller
4. Admin can sort and search within the orders list

**Alternative Flows:**

- A1: Custom date range returns no data — Display "No data found for the selected period"
- A2: Admin requests a new report type — System provides custom query builder

**Exceptions:**

- E1: Report generation timeout on large datasets — Show partial results with warning
- E2: Database connection error during report generation — Retry or show cached data

---

## 3. Class Diagram — Domain Model

### 3.1 Class Overview

The system follows a strict MVC architecture with a DAO layer for database operations. The core domain model consists of 12 entity classes.

| Class | Description | Key Attributes |
|-------|-------------|----------------|
| User (abstract) | Base class for all system users | userId, username, email, passwordHash, role, status |
| Customer | Extends User; can browse, buy, review | shippingAddress, city, state, zipCode |
| Seller | Extends User; can list and manage inventory | sellerRating, totalSales, isVerified |
| Admin | Extends User; manages system | adminLevel |
| Category | Shoe categories (Sneakers, Boots, etc.) | categoryId, categoryName, description |
| Product | Master shoe model in the catalog | productId, shoeName, brand, model, category, imageUrl |
| Listing | A seller's offer for a specific product | listingId, product, seller, size, condition, price, stockQuantity, status |
| Cart | Customer's shopping cart (1:1 with Customer) | cartId, customer, items |
| CartItem | Individual item in a cart | cartItemId, listing, quantity |
| Order | A completed purchase | orderId, customer, items, shippingAddress, paymentMethod, totalAmount, status |
| OrderItem | Individual item in an order | orderItemId, listing, quantity, priceAtPurchase |
| Review | Customer review of a product | reviewId, customer, product, rating, title, body |

### 3.2 Class Relationships

#### Inheritance (Generalization)

| Parent | Child | Description |
|--------|-------|-------------|
| User | Customer | Inherits common user attributes; adds shipping address fields |
| User | Seller | Inherits common user attributes; adds seller rating, sales count, verification |
| User | Admin | Inherits common user attributes; adds admin privilege level |

#### Associations

| Class A | Class B | Multiplicity | Type | Description |
|---------|---------|-------------|------|-------------|
| Product | Category | * to 1 | Association | Each product belongs to one category |
| Listing | Product | * to 1 | Association | Each listing references one product |
| Listing | Seller | * to 1 | Association | Each listing belongs to one seller |
| Cart | Customer | 1 to 1 | Composition | Each customer has exactly one cart |
| Cart | CartItem | 1 to * | Composition | A cart contains zero or more items |
| CartItem | Listing | * to 1 | Association | Each cart item references one listing |
| Order | Customer | * to 1 | Association | Each order belongs to one customer |
| Order | OrderItem | 1 to * | Composition | An order contains one or more items |
| OrderItem | Listing | * to 1 | Association | Each order item references the listing purchased |
| Review | Customer | * to 1 | Association | Each review is written by one customer |
| Review | Product | * to 1 | Association | Each review is for one product |

### 3.3 Database Table Mapping

| Class | Table | Primary Key | Foreign Keys |
|-------|-------|-------------|--------------|
| User / Customer / Seller / Admin | users | user_id (AUTO_INCREMENT) | — |
| Category | categories | category_id (AUTO_INCREMENT) | — |
| Product | products | product_id (AUTO_INCREMENT) | category_id → categories |
| Listing | listings | listing_id (AUTO_INCREMENT) | product_id → products, seller_id → users |
| Cart | carts | cart_id (AUTO_INCREMENT) | customer_id → users |
| CartItem | cart_items | cart_item_id (AUTO_INCREMENT) | cart_id → carts, listing_id → listings |
| Order | orders | order_id (AUTO_INCREMENT) | customer_id → users |
| OrderItem | order_items | order_item_id (AUTO_INCREMENT) | order_id → orders, listing_id → listings |
| Review | reviews | review_id (AUTO_INCREMENT) | customer_id → users, product_id → products |

---

## 4. Architecture Layers

### 4.1 DAO Layer (Data Access Objects)

Each entity has a corresponding DAO class that handles all database interactions using JDBC PreparedStatements.

| DAO Class | Key Methods |
|-----------|-------------|
| UserDAO | authenticate(email, pwd), findById(id), insert(user), deactivate(id), findByRole(role) |
| ProductDAO | findByCategory(catId), search(keyword), insert(product), findAll() |
| ListingDAO | findBySeller(id), findByCatSortedByPrice(catId), updatePriceAndStock(), softDelete(id), hasActiveOrders(id) |
| CartDAO | addItem(), removeItem(id), clearCart(custId), findByCustomer(custId) |
| OrderDAO | createOrder(order), findByCustomer(id), updateStatus(), getTotalRevenue(), getTopSellingProducts() |
| ReviewDAO | findByProduct(id), insert(review), getAverageRating(id) |
| ReportDAO | getSalesSummary(), getInventoryReport(), getUserActivityReport(), getSellerPerformance() |
| CategoryDAO | findAll(), insert(cat) |

### 4.2 Servlet Layer (Controllers)

Each servlet extends HttpServlet and handles HTTP requests for a specific functional area.

| Servlet | Responsibility | Maps to Use Cases |
|---------|---------------|-------------------|
| LoginServlet | Authentication and session creation | UC-01 |
| BrowseServlet | Category browsing, sorting, seller viewing | UC-02, UC-03 |
| CartServlet | Cart add/remove/view operations | UC-04, UC-05 |
| CheckoutServlet | Checkout flow and order creation | UC-06 |
| OrderHistoryServlet | Order history display | UC-07 |
| ListingServlet | New listing creation with catalog validation | UC-08 |
| InventoryServlet | Seller inventory management | UC-09 |
| AdminServlet | User management, catalog management | UC-10, UC-11, UC-12, UC-13 |
| ReportServlet | Report generation and order drill-down | UC-14 |

### 4.3 Utility Classes

| Class | Purpose |
|-------|---------|
| DBConnection | Singleton-style JDBC connection manager (`getConnection()`, `closeAll()`) |
| SessionManager | HttpSession wrapper for login state (`isLoggedIn()`, `getLoggedInUser()`, `getUserRole()`) |
| AuthFilter | Servlet Filter for role-based access control on protected URLs |
| PasswordUtil | Password hashing and verification (`hashPassword()`, `verifyPassword()`) |

### 4.4 Dependencies

| Dependent | Uses | Purpose |
|-----------|------|---------|
| All DAOs | DBConnection | Database connection pooling |
| All Servlets | SessionManager | Authentication checks |
| LoginServlet | UserDAO, PasswordUtil | Credential validation |
| BrowseServlet | ListingDAO, CategoryDAO, ProductDAO | Catalog data retrieval |
| CartServlet | CartDAO, ListingDAO | Cart operations with stock checks |
| CheckoutServlet | OrderDAO, CartDAO, ListingDAO | Order creation and stock management |
| AdminServlet | UserDAO, ProductDAO, ListingDAO, CategoryDAO | All admin panel operations |
| ReportServlet | ReportDAO, OrderDAO | Report generation and data export |
| AuthFilter | SessionManager | Pre-servlet access control |

---

## 5. Activity Diagrams

### 5.1 Combined Activity Diagram (4 Swimlanes)

The main activity diagram uses four swimlanes — Customer, System, Seller, Admin — showing all primary flows after login with role-based routing.

**Customer Flow:**

Start → Enter Credentials → Authenticate → Role? → (Customer) → Browse and Select Shoe → Add to Cart → Stock Check → (If no: loop back to Browse) → (If yes: Checkout and Confirm) → Process Order and Clear Cart → View Order History → End

**Seller Flow:**

Role? → (Seller) → Open Seller Dashboard → Add or Manage Listings → Update Database → End

**Admin Flow:**

Role? → (Admin) → Open Admin Dashboard → Action? → (Users / Catalog / Reports) → Log Action → End

### 5.2 Per-Use-Case Activity Flows

#### UC-01: Login

Start → Open Application → Enter Email and Password → Authenticate Credentials → Valid? → (No: Display Error → retry) → (Yes: Maintain Session → Redirect to Dashboard) → End

#### UC-02: Browse Shoes by Category

Start → Navigate to Marketplace → Select Category → Query Listings → Sort by Cheapest Price → Display Results → Results Found? → (No: "No shoes found") → (Yes: Browse Listings) → End

#### UC-03: View Sellers for a Shoe

Start → Select Shoe → Retrieve All Sellers → Display Offers → Multiple Sellers? → (Yes: Compare → Select) → (No: Select directly) → End

#### UC-04: Add Item to Cart

Start → Select Offer → Select Size/Qty → Click "Add to Cart" → Check Stock → In Stock? → (No: "Unavailable") → (Yes: Add to Cart Table → Update Subtotal → "Item Added") → End

#### UC-05: View Shopping Cart

Start → Navigate to Cart → Retrieve Items → Display Items with Subtotal → Cart Empty? → (Yes: "Cart is Empty") → (No: Remove Items? → Yes: Delete Items → Recalculate → loop / No: Proceed to Checkout) → End

#### UC-06: Checkout

Start → "Proceed to Checkout" → Display Summary → Enter Shipping → Select Payment → Review → "Place Order" → Validate Stock → Stock OK? → (No: Notify Customer) → (Yes: Create Order via Stored Procedure → Decrement Stock via Trigger → Clear Cart → Display Confirmation) → End

#### UC-07: View Order History

Start → "My Orders" → Query by Customer ID → Orders Exist? → (No: "No Orders Yet") → (Yes: Display List → Select Order → Display Details) → End

#### UC-08: Add New Listing

Start → "My Listings" → "Add New Listing" → Search Product → Validate in Catalog → Found? → (No: "Not in Catalog") → (Yes: Enter Details → Upload Images → "Publish" → Create Listing Record → Active in Marketplace) → End

#### UC-09: Manage Inventory

Start → "Manage Inventory" → View Current Listings → Display All → Action? → (Update: Select → Update Price/Stock → Save) / (Remove: Select → Active Orders? → Yes: Prevent Removal / No: Soft Delete) → End

#### UC-10: View All Users

Start → "View All Users" → Query Users → Display List → Search/Filter? → (Yes: Apply → refresh) → (No: Select User → Display Details) → End

#### UC-11: View All Products

Start → "View All Products" → Retrieve Catalog → Display Products → Filter? → (Yes: Apply → refresh) → (No: Select Product → Display Listings) → End

#### UC-12: Manage Product Catalog

Start → "Manage Product Catalog" → Display Catalog → "Add New Product" → Enter Details → Upload Image → Duplicate? → (Yes: "Already Exists") → (No: Create Record → Available for Sellers) → End

#### UC-13: Manage Users

Start → "Manage Users" → Display Users → Action? → (Add: Select Role → Enter Details → Duplicate Email? → Yes: Error / No: Create Account → Send Credentials) / (Remove: Select User → Active Orders? → Yes: Warn / No: Deactivate → Hide Listings) → Log Action → End

#### UC-14: Generate Database Reports

Start → "Generate Reports" → Select Type → Set Filters → Execute SQL → Display Report → Drill into Orders? → (Yes: View All Orders) → Export? → (Yes: Export CSV) → End

---

## 6. Sequence Diagram

The system-level sequence diagram shows message flow across four lifelines: Customer, System, Seller, Admin.

### 6.1 Login Flow (All Actors)

```
Customer → System: Enter Credentials
System → System: Authenticate Credentials
  alt Invalid
    System → Customer: Display Error
  else Valid
    System → Customer: Create Session, Redirect to Dashboard
  end
```

### 6.2 Customer Purchase Flow

```
Customer → System: Browse Shoes by Category
System → Customer: Display Filtered Listings
Customer → System: View Sellers for a Shoe
System → Customer: Display Seller Offers
Customer → System: Select Offer, Add to Cart
System → System: Check Stock Availability
  alt Out of Stock
    System → Customer: Display "Unavailable"
  else In Stock
    System → Customer: Update Cart
  end
Customer → System: View Cart, Proceed to Checkout
Customer → System: Enter Shipping and Payment
Customer → System: Confirm Order
System → System: Create Order (Stored Procedure)
System → System: Decrement Stock (DB Trigger)
System → System: Clear Cart
System → Customer: Display Order Confirmation
Customer → System: View Order History
System → Customer: Display Orders
```

### 6.3 Seller Flow

```
Seller → System: Add New Listing
System → System: Validate Product in Catalog
  alt Not Found
    System → Seller: Display "Not in Catalog"
  else Found
    Seller → System: Enter Details and Publish
    System → Seller: Listing Created
  end
Seller → System: View Current Listings
System → Seller: Display Listings
Seller → System: Update Price/Stock or Remove
System → Seller: Database Updated
```

### 6.4 Admin Flow

```
Admin → System: View All Users
System → Admin: Display Users
Admin → System: Add or Remove User
System → Admin: User Record Updated
Admin → System: Manage Product Catalog
System → Admin: Catalog Updated
Admin → System: Generate Reports
System → Admin: Display Report Data
```

---

## 7. Database Design

### 7.1 Stored Procedures

| Procedure | Purpose | Called By |
|-----------|---------|----------|
| sp_create_order | Creates order record, order items, assigns Order ID | CheckoutServlet |
| sp_create_listing | Creates listing record, assigns Listing ID | ListingServlet |
| sp_create_user | Creates user record with hashed password | AdminServlet |

### 7.2 Database Triggers

| Trigger | Event | Action |
|---------|-------|--------|
| trg_decrement_stock | AFTER INSERT on order_items | Decrements listing stock by order quantity |
| trg_auto_soldout | AFTER UPDATE on listings | Sets status to "SoldOut" when stock reaches 0 |
| trg_update_avg_rating | AFTER INSERT on reviews | Recalculates product average rating |

### 7.3 Key SQL Patterns Used

- Complex JOINs across orders, order_items, listings, products, users for report generation
- GROUP BY with aggregate functions (SUM, COUNT, AVG) for sales summaries
- Subqueries for top-selling products and seller performance metrics
- LIKE / full-text search for product keyword search
- Transaction management (BEGIN, COMMIT, ROLLBACK) for order processing

---

## 8. Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| Security | Password hashing (bcrypt/SHA-256), session-based auth, role-based access via AuthFilter |
| Data Integrity | Foreign key constraints, soft deletes to preserve history, transaction rollback on failure |
| Performance | Indexed queries on frequently filtered columns (category_id, seller_id, status), paginated results |
| Scalability | DAO pattern allows swapping database implementations without changing business logic |
| Auditability | All admin actions logged with timestamp and admin ID |
| Usability | Role-based dashboards, form validation with meaningful error messages |

---

## 9. Project File Structure

```
HYPECULTURE/
├── src/
│   ├── model/
│   │   ├── User.java
│   │   ├── Customer.java
│   │   ├── Seller.java
│   │   ├── Admin.java
│   │   ├── Category.java
│   │   ├── Product.java
│   │   ├── Listing.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   └── Review.java
│   ├── dao/
│   │   ├── UserDAO.java
│   │   ├── ProductDAO.java
│   │   ├── ListingDAO.java
│   │   ├── CartDAO.java
│   │   ├── OrderDAO.java
│   │   ├── ReviewDAO.java
│   │   ├── ReportDAO.java
│   │   └── CategoryDAO.java
│   ├── servlet/
│   │   ├── LoginServlet.java
│   │   ├── BrowseServlet.java
│   │   ├── CartServlet.java
│   │   ├── CheckoutServlet.java
│   │   ├── OrderHistoryServlet.java
│   │   ├── ListingServlet.java
│   │   ├── InventoryServlet.java
│   │   ├── AdminServlet.java
│   │   └── ReportServlet.java
│   └── util/
│       ├── DBConnection.java
│       ├── SessionManager.java
│       ├── AuthFilter.java
│       └── PasswordUtil.java
├── web/
│   ├── WEB-INF/
│   │   └── web.xml
│   ├── jsp/
│   │   ├── login.jsp
│   │   ├── customer/
│   │   │   ├── browse.jsp
│   │   │   ├── sellers.jsp
│   │   │   ├── cart.jsp
│   │   │   ├── checkout.jsp
│   │   │   ├── confirmation.jsp
│   │   │   └── orders.jsp
│   │   ├── seller/
│   │   │   ├── dashboard.jsp
│   │   │   ├── new-listing.jsp
│   │   │   └── inventory.jsp
│   │   └── admin/
│   │       ├── dashboard.jsp
│   │       ├── users.jsp
│   │       ├── products.jsp
│   │       ├── catalog.jsp
│   │       └── reports.jsp
│   └── css/
│       └── style.css
├── sql/
│   ├── schema.sql
│   ├── seed-data.sql
│   ├── stored-procedures.sql
│   └── triggers.sql
└── README.md
```

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| Listing | A seller's specific offer for a product (with price, size, condition, stock) |
| Product | A master shoe model in the catalog (e.g., "Nike Air Max 90") that sellers create listings for |
| Category | A classification group for shoes (Sneakers, Boots, Running, Casual) |
| Cart | A temporary holding area for items a customer intends to purchase |
| Order | A confirmed purchase with payment and shipping details |
| Soft Delete | Marking a record as inactive rather than physically deleting it, to preserve historical data |
| Stored Procedure | A precompiled SQL routine stored in the database, used for complex transactional operations |
| Database Trigger | An automatic SQL action fired on INSERT/UPDATE/DELETE events |
| DAO | Data Access Object — a design pattern that separates database logic from business logic |
| MVC | Model-View-Controller — architectural pattern separating data, presentation, and control logic |
| JSP | JavaServer Pages — Java-based view technology for generating HTML responses |
| JDBC | Java Database Connectivity — Java API for executing SQL statements |
| HttpSession | Server-side session object in Java Servlets used to maintain user state across requests |
