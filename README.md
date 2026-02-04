# Finances App

A personal finance application to track your expenses, incomes, liabilities, assets, and current balance.

## Features

### ✅ Sprint 1 - Core Transaction Management (COMPLETED)

- **Transaction Management**
  - Add, edit, and delete transactions
  - Support for Income, Expenses, Assets, and Liabilities
  - Recurring transactions with frequency options
  - Tags for better organization
  - Rich form validation with Zod

- **Transaction List**
  - Advanced filtering (by type, category, date range)
  - Search by description or tags
  - Sort by date or amount
  - Real-time updates

- **Dashboard**
  - Financial summary cards (Income, Expenses, Balance, Net Worth)
  - Recent transactions view
  - Quick action buttons
  - Real-time calculations

- **Data Persistence**
  - **PostgreSQL** database (local)
  - **Prisma** ORM for type-safe access
  - API routes for CRUD operations
  - Seed script for default categories

- **Navigation**
  - Top navigation bar with Dashboard and Transactions
  - Active link highlighting
  - Database error banner with retry when DB is unavailable

- **Categories**
  - Pre-defined categories for all transaction types
  - Income: Salary, Freelance, Investments, Gifts, Other
  - Expenses: Housing, Food, Transport, Utilities, Entertainment, Healthcare, Shopping, Education, Other
  - Assets: Cash, Savings, Investments, Property, Vehicles, Other
  - Liabilities: Credit Card, Personal Loan, Mortgage, Car Loan, Student Loan, Other

## Tech Stack

- **React 19** - UI library
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Local database
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. **Set up the local database** (PostgreSQL + Prisma):

See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for full steps. Summary:

- Create a PostgreSQL database (e.g. `finances_app`).
- Copy `.env.example` to `.env` and set `DATABASE_URL`.
- Run `npm run db:migrate` then `npm run db:seed`.

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pushing to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (do not add a README or .gitignore; the project already has them).
2. From the project root, run:

```bash
git init
git add .
git commit -m "Initial commit: Finances app with local PostgreSQL"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finances-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `finances-app` with your GitHub username and repo name. Your `.env` file is ignored by `.gitignore`, so your local `DATABASE_URL` is never uploaded.

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com), sign in, and click **Add New → Project**.
2. Import your GitHub repository (`finances-app`).
3. Vercel will detect Next.js; keep the default build command (`npm run build` uses `prisma generate && next build`).
4. **Environment variables:** Leave **DATABASE_URL** unset if you only want the app to run with your local PostgreSQL. The deployed site will load but API calls will show a database connection message. When you want the live site to use a database, add **DATABASE_URL** in Project Settings → Environment Variables with a hosted PostgreSQL URL (e.g. [Neon](https://neon.tech), [Vercel Postgres](https://vercel.com/storage/postgres), or [Supabase](https://supabase.com)).
5. Click **Deploy**. After the build finishes, your app will be live.

You can keep using your local PostgreSQL for development; the Vercel deployment is independent.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Generate Prisma client and build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (no migrations)
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed default categories
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
finances-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Dashboard page
│   │   ├── transactions/         # Transactions page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   ├── containers/           # Container components
│   │   ├── forms/                # Form components
│   │   │   └── TransactionForm.tsx
│   │   ├── modals/               # Modal components
│   │   │   └── EditTransactionModal.tsx
│   │   ├── singles/              # Single-purpose components
│   │   └── transactions/         # Transaction-specific components
│   │       └── TransactionList.tsx
│   ├── context/
│   │   └── FinanceContext.tsx    # Global state management
│   ├── lib/
│   │   ├── categories.ts         # Category definitions
│   │   ├── storage.ts            # localStorage utilities
│   │   └── utils.ts              # Helper functions
│   └── types.ts                  # TypeScript type definitions
├── eslint.config.mjs             # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── tailwind.config.ts            # Tailwind configuration
```

## Usage

### Adding a Transaction

1. Navigate to the Transactions page
2. Click "Add Transaction"
3. Select transaction type (Income/Expense/Asset/Liability)
4. Choose a category
5. Enter amount, description, and date
6. Optionally mark as recurring and add tags
7. Click "Add Transaction"

### Filtering Transactions

Use the filter panel to:

- Filter by transaction type
- Filter by category
- Set date range
- Search by description or tags
- Sort by date or amount

### Editing/Deleting Transactions

- Click "Edit" on any transaction to modify it
- Click "Delete" to remove a transaction (with confirmation)

## Data Storage

Data is stored in **PostgreSQL** (local by default). Your `.env` with `DATABASE_URL` is not committed to Git, so you keep using your local database for development. The deployed app on Vercel will only connect to a database if you set `DATABASE_URL` in Vercel’s environment variables (e.g. a hosted Postgres); otherwise the live site will show a database connection message.

## Coming Next

### Sprint 2 - Dashboard Enhancement

- Summary cards with trends
- Basic charts (income vs expenses)
- Category breakdown visualization
- Monthly/yearly views

### Sprint 3 - Advanced Features

- Budget tracking
- Financial goals
- Recurring transaction automation
- Advanced analytics

## Development

Built with modern web technologies and best practices:

- Type-safe with TypeScript
- Form validation with Zod
- React Context for state management
- Responsive design with Tailwind CSS
- ESLint + Prettier for code quality
