# Local Database Setup (PostgreSQL + Prisma)

This project uses **PostgreSQL** and **Prisma 7** for local data storage. Everything runs on your computer. Prisma 7 uses the **pg** driver adapter for direct PostgreSQL connections.

## Prerequisites

- **PostgreSQL** installed and running locally (e.g. [PostgreSQL Downloads](https://www.postgresql.org/download/))
- Node.js and npm

## 1. Create the database

Using `psql` or any PostgreSQL client, create a database:

```sql
CREATE DATABASE finances_app;
```

Or with the command line:

```bash
# Windows (if psql is in PATH)
psql -U postgres -c "CREATE DATABASE finances_app;"

# macOS/Linux
createdb -U postgres finances_app
```

## 2. Configure the connection

Copy the example env file and set your local PostgreSQL URL:

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your local PostgreSQL connection:

```env
# Replace YOUR_PASSWORD with your PostgreSQL user password
# Replace postgres with your username if different
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/finances_app?schema=public"
```

Examples:

- Default local user `postgres`, password `postgres`:
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finances_app?schema=public"
  ```
- No password (local trust):
  ```env
  DATABASE_URL="postgresql://postgres@localhost:5432/finances_app?schema=public"
  ```

## 3. Run migrations and seed

From the project root:

```bash
# Create tables from the Prisma schema
npm run db:migrate

# When prompted for a migration name, you can use: init
# This creates the categories and transactions tables.

# Seed default categories (Income, Expense, Asset, Liability)
npm run db:seed
```

**Alternative (no migration history):** If you prefer to sync the schema without migration files (e.g. local-only):

```bash
npm run db:push
npm run db:seed
```

## 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Data is stored in your local PostgreSQL database.

## Useful commands

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run db:generate` | Generate Prisma Client              |
| `npm run db:push`    | Push schema to DB (no migrations)    |
| `npm run db:migrate` | Create and run migrations            |
| `npm run db:seed`    | Seed default categories              |
| `npm run db:studio`  | Open Prisma Studio (DB GUI)         |

## Troubleshooting

### P1000: Authentication failed

This means PostgreSQL rejected the username or password in `DATABASE_URL`. Fix it like this:

1. **Use the same credentials as pgAdmin**
   - In pgAdmin, open your server connection (right‑click → Properties or check how you connect).
   - Note the **username** (often `postgres`) and the **password** you use to connect.
   - Put that **exact** username and password in `.env` (see step 2).

2. **Create a `.env` file in the project root** (same folder as `package.json`):
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set:
   ```env
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:PORT/finances_app?schema=public"
   ```
   Replace:
   - `USERNAME` – same as in pgAdmin (e.g. `postgres`)
   - `PASSWORD` – same as in pgAdmin
   - `PORT` – usually `5432`; if your PostgreSQL uses another port (e.g. 5433), use that.

3. **If your password contains special characters**, URL‑encode them in `DATABASE_URL`:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `/` → `%2F`
   - `:` → `%3A`
   - `?` → `%3F`
   Example: password `pass@word` → `pass%40word` in the URL.

4. **Run migrations from the project root** so `.env` is loaded:
   ```bash
   cd C:\Users\Bangho\Documents\Projects\finances-app
   npm run db:migrate
   ```

5. **Check that `.env` is loaded** (from project root):
   ```bash
   node -e "require('dotenv').config(); console.log('DATABASE_URL is', process.env.DATABASE_URL ? 'set (length ' + process.env.DATABASE_URL.length + ')' : 'NOT set');"
   ```
   If it prints `NOT set`, the `.env` file is missing or not in the project root.

### No categories in the database or on the website

The app gets categories from the database. If the **categories** table is empty, the dropdown when creating a transaction will be empty. Run the seed:

```bash
npm run db:seed
```

You should see: `Seeded 26 categories.` Then refresh the app; the category dropdown should show options (Salary, Housing, Food & Dining, etc.).

### Other issues

- **"Database does not exist"** – Create the database (step 1).
- **"Failed to load data"** in the app – Ensure you ran `db:migrate` (or `db:push`) and `db:seed`.
- **Port 5432 in use** – Use the port your PostgreSQL actually uses in `DATABASE_URL`, e.g. `localhost:5433`.

## Data location

All data stays on your machine:

- PostgreSQL stores data in its data directory (e.g. `C:\Program Files\PostgreSQL\16\data` on Windows).
- No cloud or external services are used.
- Back up by exporting from Prisma Studio or using `pg_dump`.
