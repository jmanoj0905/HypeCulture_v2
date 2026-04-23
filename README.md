# HypeCulture

## Run With Docker

Start the full stack with one command:

```bash
docker compose up --build
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080/hypeculture`
- MySQL: `localhost:3306`

Default seeded accounts all use password `password123`.

Examples:

- Customer: `jordan@example.com`
- Seller: `kicks@vault.com`
- Admin: `admin@hypeculture.com`

Stop everything:

```bash
docker compose down
```

Reset the database volume and reseed from scratch:

```bash
docker compose down -v
docker compose up --build
```
