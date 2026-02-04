# Finances App

A personal finance application to track expenses, income, liabilities, assets, and current balance.

## Features

- **Transactions** – Add, edit, and delete transactions (Income, Expense, Asset, Liability) with categories, recurring options, and tags
- **Transaction list** – Filter by type, category, date range; search by description or tags; sort by date or amount
- **Dashboard** – Summary cards (Income, Expenses, Balance, Net Worth), recent transactions, quick actions
- **Categories** – Pre-defined categories for all transaction types; seed script for default data
- **Data** – PostgreSQL with Prisma; API routes for CRUD; database error banner with retry

Sprint history and roadmap: [SPRINTS.md](./SPRINTS.md).

## Tech Stack

- **React 19** – UI
- **Next.js 15** – App Router
- **TypeScript** – Types
- **Tailwind CSS** – Styling
- **Prisma** – PostgreSQL ORM
- **PostgreSQL** – Database
- **React Hook Form** – Forms
- **Zod** – Validation
- **ESLint** + **Prettier** – Lint & format

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database**

   See [DATABASE_SETUP.md](./DATABASE_SETUP.md). Summary:
   - Create a PostgreSQL database (e.g. `finances_app`)
   - Copy `.env.example` to `.env` and set `DATABASE_URL`
   - Run `npm run db:migrate` then `npm run db:seed`

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Pushing to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (no README or .gitignore).
2. From the project root:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Finances app with local PostgreSQL"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/finances-app.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `finances-app` with your GitHub username and repo name. `.env` is in `.gitignore` and is not uploaded.

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your GitHub repo (`finances-app`).
3. Keep the default build command (`npm run build`).
4. **Environment variables:** If `DATABASE_URL` is unset, the site loads but API calls return 500. To use your **local** PostgreSQL with the deployed app, see [Using your local PostgreSQL with Vercel](#using-your-local-postgresql-with-vercel) below. Otherwise set `DATABASE_URL` to a hosted PostgreSQL URL (e.g. [Neon](https://neon.tech), [Vercel Postgres](https://vercel.com/storage/postgres), [Supabase](https://supabase.com)).
5. Click **Deploy**.

### Using your local PostgreSQL with Vercel

The deployed app runs on Vercel; it cannot connect to `localhost` on your machine. To have the live site use your **local** database:

1. **Expose PostgreSQL with a tunnel** (e.g. [ngrok](https://ngrok.com)):
   - Install ngrok and create a free account.
   - Start local PostgreSQL (e.g. port 5432 or 5433).
   - Run: `ngrok tcp 5432` (use your actual port).
   - Note the public host and port (e.g. `0.tcp.ngrok.io:12345`).

2. **Build the connection string** (same user/password/database as in `.env`, but with ngrok host and port):

   ```text
   postgresql://postgres:YOUR_PASSWORD@0.tcp.ngrok.io:12345/finances_app?schema=public
   ```

   Replace host, port, password, and database name. URL-encode special characters in the password.

3. **Set `DATABASE_URL` on Vercel:** Project → **Settings** → **Environment Variables** → add `DATABASE_URL` with the value above → **Redeploy**.

4. **Keep the tunnel running** when you want the live site to use your local DB. If the ngrok URL changes, update `DATABASE_URL` on Vercel and redeploy.

**Security:** While the tunnel is running, the database is reachable from the internet. Use a strong password and only run the tunnel when needed.

**Still getting 500?** The app uses plain TCP (`ssl: false`) and a 15s timeout for ngrok URLs. Check: (1) **Vercel logs** – Deployments → select deployment → **Functions** → open a failing request (e.g. `/api/transactions`) → **Logs** to see the real error. (2) **Connection string** – Use the host and port from `ngrok tcp 5432` (e.g. `0.tcp.ngrok.io:12345`); no `tcp://` in the URL; URL-encode special characters in the password. (3) **Redeploy** after changing `DATABASE_URL` on Vercel.

## Available Scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start development server                        |
| `npm run build`        | Generate Prisma client and build for production |
| `npm run start`        | Start production server                         |
| `npm run lint`         | Run ESLint                                      |
| `npm run format`       | Format with Prettier                            |
| `npm run format:check` | Check formatting                                |
| `npm run db:generate`  | Generate Prisma client                          |
| `npm run db:push`      | Push schema (no migrations)                     |
| `npm run db:migrate`   | Run migrations                                  |
| `npm run db:seed`      | Seed default categories                         |
| `npm run db:studio`    | Open Prisma Studio                              |

## Project Structure

```text
finances-app/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (transactions, categories, summary)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard
│   │   ├── transactions/
│   │   └── globals.css
│   ├── components/
│   │   ├── charts/
│   │   ├── common/
│   │   ├── containers/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── modals/
│   │   ├── singles/
│   │   └── transactions/
│   ├── context/
│   ├── lib/
│   └── types.ts
├── .env.example
├── DATABASE_SETUP.md
├── SPRINTS.md                  # Sprint history & roadmap
└── README.md
```

## Usage

### Adding a transaction

1. Go to **Transactions**.
2. Click **Add Transaction**.
3. Choose type (Income / Expense / Asset / Liability), category, amount, description, date.
4. Optionally set recurring and tags.
5. Click **Add Transaction**.

### Filtering and search

- Filter by type, category, date range.
- Search by description or tags.
- Sort by date or amount.

### Editing and deleting

- Use **Edit** on a transaction to change it.
- Use **Delete** to remove it (with confirmation).

## Data Storage

Data is stored in **PostgreSQL**. Your `.env` (with `DATABASE_URL`) is not committed; use it for local development. The deployed app on Vercel uses the database only if `DATABASE_URL` is set in Vercel (e.g. via ngrok tunnel to your local DB or a hosted Postgres).

## Development

- TypeScript for type safety
- Zod for validation
- React Context for app state
- Tailwind for layout and styling
- ESLint and Prettier for code quality
