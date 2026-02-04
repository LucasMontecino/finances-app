# Sprints & Roadmap

Sprint history and planned work for the Finances app.

## Sprint 1 – Core Transaction Management (Completed)

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
  - PostgreSQL database (local)
  - Prisma ORM for type-safe access
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

For a detailed Sprint 1 summary, see [SPRINT1_COMPLETE.md](./SPRINT1_COMPLETE.md).

---

## Coming Next

### Sprint 2 – Dashboard Enhancement

- Summary cards with trends
- Basic charts (income vs expenses)
- Category breakdown visualization
- Monthly/yearly views

### Sprint 3 – Advanced Features

- Budget tracking
- Financial goals
- Recurring transaction automation
- Advanced analytics
