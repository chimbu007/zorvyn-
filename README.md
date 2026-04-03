# Finora Finance Dashboard

A finance dashboard built with React.js for the Zoryn frontend assignment. It uses static mock data, INR currency formatting, a component-based structure, responsive layouts, and a few restrained motion details to make the interface feel polished and usable.

## Tech stack

- React.js
- Vite
- CSS
- Static mock data
- Local storage for UI persistence

## Approach

The goal was to keep the experience easy to understand while still looking intentional in an interview setting. I kept the state in one parent component, `App`, and split the interface into smaller child components so the code stays readable without becoming over-engineered.

That approach lets the project stay straightforward while still showing:

- Component composition
- State management in React
- Derived UI data built from helper functions
- Role-based rendering on the frontend
- Responsive and accessible layout decisions

## Features

### Dashboard overview

- Total Balance card
- Income card
- Expenses card
- Savings Rate card
- Time-based visualization for monthly balance trend and savings
- Weekly comparison summary
- Categorical visualization for spending breakdown

### Transactions

- Transaction list with:
  - Date
  - Amount
  - Category
  - Type
  - Note
- Simple search
- Category filtering
- Type filtering
- Sorting by date and amount

### Role-based UI

- `Viewer` can only view data
- `Admin` can add, edit, and delete transactions
- Role can be switched from a dropdown in the sidebar

### Insights

- Highest spending category
- Monthly expense comparison
- Useful income observation

### UI/UX touches

- Dark mode toggle
- Soft motion and section entrance animations
- Hover states and smooth transitions
- Clean empty state handling
- Responsive design for desktop and mobile

## Component structure

The app follows a single parent plus child component pattern:

- `src/App.jsx`
  - Parent component that manages:
    - transactions
    - role
    - dark mode
    - filters
    - modal state
- Child components:
  - `Sidebar`
  - `HeroSection`
  - `OverviewSection`
  - `SummaryCard`
  - `BalanceTrendChart`
  - `CategoryChart`
  - `TransactionsSection`
  - `InsightsSection`
  - `TransactionModal`

## State management

State is handled in the parent `App` component using React hooks:

- `transactions` for finance data
- `filters` for searching and sorting
- `role` for simulating viewer/admin behavior
- `darkMode` for theme switching
- `modalOpen` and `selectedTransaction` for transaction editing

The selected theme, role, and transactions are persisted in `localStorage`.

## How to run

1. Open a terminal in the project folder:

```powershell
cd "C:\Users\chida\OneDrive\Desktop\zoryn assignment"
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

4. Open the local URL shown by Vite in your browser.

## Build for production

```powershell
npm run build
```

## What this demonstrates

- Clear frontend structure using React components
- Good handling of static data and derived summaries
- Clean responsive UI design
- Simulated RBAC behavior without backend logic
- Thoughtful interactions and visual polish without overcomplicating the UI
- Readable code organization suitable for an interview assignment
