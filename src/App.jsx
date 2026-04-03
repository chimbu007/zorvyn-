import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import HeroSection from "./components/HeroSection";
import OverviewSection from "./components/OverviewSection";
import TransactionsSection from "./components/TransactionsSection";
import InsightsSection from "./components/InsightsSection";
import TransactionModal from "./components/TransactionModal";
import { mockTransactions, roleDescriptions } from "./data/mockData";

const APP_STORAGE_KEY = "finora-dashboard-preferences";

const filterDefaults = {
  search: "",
  category: "all",
  type: "all",
  sortBy: "date-desc"
};

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const compactMoneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

const shortMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short"
});

const shortWeekFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});

export default function App() {
  const savedState = readSavedDashboardState();
  const [role, setRole] = useState(savedState.role);
  const [darkMode, setDarkMode] = useState(savedState.darkMode);
  const [transactions, setTransactions] = useState(savedState.transactions);
  const [filters, setFilters] = useState(filterDefaults);
  const [trendView, setTrendView] = useState("monthly");
  const [categoryView, setCategoryView] = useState("expenses");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftTransaction, setDraftTransaction] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    saveDashboardState({ role, darkMode, transactions });
  }, [role, darkMode, transactions]);

  const availableCategories = useMemo(() => {
    const names = new Set(transactions.map((entry) => entry.category));
    return [...names].sort((left, right) => left.localeCompare(right));
  }, [transactions]);

  const visibleTransactions = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters]
  );

  const financialSnapshot = useMemo(
    () => summarizeTransactions(transactions),
    [transactions]
  );

  const monthlyTrend = useMemo(
    () => groupTransactionsByMonth(transactions),
    [transactions]
  );

  const weeklyTrend = useMemo(
    () => groupTransactionsByWeek(transactions),
    [transactions]
  );

  const weekOnWeek = useMemo(
    () => compareRecentWeeks(transactions),
    [transactions]
  );

  const categoryBreakdown = useMemo(
    () => groupTransactionsByCategory(transactions, categoryView),
    [transactions, categoryView]
  );

  const insightCards = useMemo(
    () =>
      buildInsightCards({
        transactions,
        monthlyTrend,
        categoryBreakdown
      }),
    [transactions, monthlyTrend, categoryBreakdown]
  );

  const summaryCards = [
    {
      label: "Total balance",
      value: formatCurrency(financialSnapshot.balance),
      note: "Current net position after combining all inflow and outflow activity.",
      accentClass: "summary-card--balance"
    },
    {
      label: "Income",
      value: formatCurrency(financialSnapshot.income),
      note: "Salary, freelance work, and other incoming amounts in the current dataset.",
      accentClass: "summary-card--income"
    },
    {
      label: "Expenses",
      value: formatCurrency(financialSnapshot.expenses),
      note: "Every outgoing transaction including bills, essentials, and lifestyle spend.",
      accentClass: "summary-card--expense"
    },
    {
      label: "Savings rate",
      value: `${financialSnapshot.savingsRate}%`,
      note: "A simple ratio showing how much of total income was retained.",
      accentClass: "summary-card--rate"
    }
  ];

  const handleOpenEditor = (transaction = null) => {
    if (role !== "admin") return;
    setDraftTransaction(transaction);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setDraftTransaction(null);
    setIsEditorOpen(false);
  };

  const handleSaveTransaction = (nextTransaction) => {
    setTransactions((currentTransactions) => {
      const cleanTransaction = {
        ...nextTransaction,
        category: nextTransaction.category.trim(),
        note: nextTransaction.note.trim()
      };

      if (!draftTransaction) {
        return [cleanTransaction, ...currentTransactions];
      }

      return currentTransactions.map((entry) =>
        entry.id === cleanTransaction.id ? cleanTransaction : entry
      );
    });

    handleCloseEditor();
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((entry) => entry.id !== transactionId)
    );
    handleCloseEditor();
  };

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        setRole={setRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        roleDescriptions={roleDescriptions}
      />

      <main className="dashboard">
        <HeroSection
          monthCount={monthlyTrend.length}
          transactionCount={transactions.length}
          savingsRate={financialSnapshot.savingsRate}
        />

        <OverviewSection
          summaryCards={summaryCards}
          monthlyData={monthlyTrend}
          weeklyData={weeklyTrend}
          weeklyComparison={weekOnWeek}
          trendView={trendView}
          onTrendViewChange={setTrendView}
          categoryData={categoryBreakdown}
          categoryView={categoryView}
          onCategoryViewChange={setCategoryView}
          formatCurrency={formatCurrency}
          formatCompactCurrency={formatCompactCurrency}
        />

        <TransactionsSection
          role={role}
          filters={filters}
          setFilters={setFilters}
          categories={availableCategories}
          transactions={visibleTransactions}
          onOpenModal={handleOpenEditor}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <InsightsSection insights={insightCards} />
      </main>

      <TransactionModal
        open={isEditorOpen}
        role={role}
        selectedTransaction={draftTransaction}
        onClose={handleCloseEditor}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}

function readSavedDashboardState() {
  const fallback = {
    role: "viewer",
    darkMode: false,
    transactions: mockTransactions
  };

  try {
    const rawState = localStorage.getItem(APP_STORAGE_KEY);
    if (!rawState) return fallback;

    const parsedState = JSON.parse(rawState);
    return {
      role: parsedState?.role || fallback.role,
      darkMode: parsedState?.darkMode ?? fallback.darkMode,
      transactions: Array.isArray(parsedState?.transactions)
        ? parsedState.transactions
        : fallback.transactions
    };
  } catch {
    return fallback;
  }
}

function saveDashboardState(nextState) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(nextState));
}

function applyTransactionFilters(transactions, filters) {
  const searchTerm = filters.search.trim().toLowerCase();

  return [...transactions]
    .filter((entry) => {
      const matchesSearch =
        entry.category.toLowerCase().includes(searchTerm) ||
        entry.note.toLowerCase().includes(searchTerm);
      const matchesCategory =
        filters.category === "all" || entry.category === filters.category;
      const matchesType = filters.type === "all" || entry.type === filters.type;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((left, right) => compareTransactions(left, right, filters.sortBy));
}

function summarizeTransactions(transactions) {
  const income = totalByType(transactions, "income");
  const expenses = totalByType(transactions, "expense");
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return { income, expenses, balance, savingsRate };
}

function totalByType(transactions, type) {
  return transactions.reduce((total, entry) => {
    return entry.type === type ? total + entry.amount : total;
  }, 0);
}

function groupTransactionsByMonth(transactions) {
  return buildTimeSeries(transactions, (entry) => entry.date.slice(0, 7), formatMonthLabel);
}

function groupTransactionsByWeek(transactions) {
  return buildTimeSeries(transactions, getWeekStartKey, formatWeekLabel);
}

function buildTimeSeries(transactions, keySelector, labelSelector) {
  const grouped = new Map();

  transactions.forEach((entry) => {
    const bucketKey = keySelector(entry);

    if (!grouped.has(bucketKey)) {
      grouped.set(bucketKey, { income: 0, expense: 0 });
    }

    grouped.get(bucketKey)[entry.type] += entry.amount;
  });

  let runningBalance = 0;

  return [...grouped.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([bucketKey, values]) => {
      const savings = values.income - values.expense;
      runningBalance += savings;

      return {
        key: bucketKey,
        label: labelSelector(bucketKey),
        income: values.income,
        expense: values.expense,
        savings,
        balance: runningBalance
      };
    });
}

function compareRecentWeeks(transactions) {
  if (!transactions.length) {
    return {
      currentWeekSavings: 0,
      previousWeekSavings: 0,
      difference: 0
    };
  }

  const newestTransactionDate = transactions.reduce((latest, entry) => {
    const entryDate = new Date(entry.date);
    return entryDate > latest ? entryDate : latest;
  }, new Date(transactions[0].date));

  const currentWindowStart = new Date(newestTransactionDate);
  currentWindowStart.setDate(newestTransactionDate.getDate() - 6);

  const previousWindowEnd = new Date(currentWindowStart);
  previousWindowEnd.setDate(currentWindowStart.getDate() - 1);

  const previousWindowStart = new Date(previousWindowEnd);
  previousWindowStart.setDate(previousWindowEnd.getDate() - 6);

  const currentWeekSavings = netAmountInRange(
    transactions,
    currentWindowStart,
    newestTransactionDate
  );

  const previousWeekSavings = netAmountInRange(
    transactions,
    previousWindowStart,
    previousWindowEnd
  );

  return {
    currentWeekSavings,
    previousWeekSavings,
    difference: currentWeekSavings - previousWeekSavings
  };
}

function netAmountInRange(transactions, start, end) {
  return transactions.reduce((net, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate < start || entryDate > end) return net;
    return net + (entry.type === "income" ? entry.amount : -entry.amount);
  }, 0);
}

function groupTransactionsByCategory(transactions, categoryView) {
  const expectedType = categoryView === "expenses" ? "expense" : "income";
  const totals = {};

  transactions.forEach((entry) => {
    if (entry.type !== expectedType) return;
    totals[entry.category] = (totals[entry.category] || 0) + entry.amount;
  });

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((left, right) => right.total - left.total);
}

function buildInsightCards({ transactions, monthlyTrend, categoryBreakdown }) {
  const topCategory = categoryBreakdown[0];
  const latestMonth = monthlyTrend.at(-1);
  const previousMonth = monthlyTrend.at(-2);
  const monthlyDifference =
    latestMonth && previousMonth ? latestMonth.expense - previousMonth.expense : 0;

  const biggestIncome = [...transactions]
    .filter((entry) => entry.type === "income")
    .sort((left, right) => right.amount - left.amount)[0];

  return [
    {
      label: "Highest spending category",
      value: topCategory ? topCategory.label : "No data",
      copy: topCategory
        ? `${formatCurrency(topCategory.total)} was spent here, making it the biggest cost bucket in the current view.`
        : "Add expense entries to surface category-level patterns."
    },
    {
      label: "Monthly comparison",
      value: previousMonth
        ? `${monthlyDifference > 0 ? "+" : ""}${formatCurrency(monthlyDifference)}`
        : "No comparison",
      copy: previousMonth
        ? `${latestMonth.label} expenses came in ${monthlyDifference > 0 ? "higher" : "lower"} than ${previousMonth.label}.`
        : "A comparison will appear once at least two monthly periods are available."
    },
    {
      label: "Useful observation",
      value: biggestIncome ? biggestIncome.category : "No data",
      copy: biggestIncome
        ? `The strongest income entry landed on ${formatDate(biggestIncome.date)} at ${formatCurrency(biggestIncome.amount)}.`
        : "Add income entries to unlock a quick earnings observation."
    }
  ];
}

function compareTransactions(left, right, sortBy) {
  switch (sortBy) {
    case "date-asc":
      return new Date(left.date) - new Date(right.date);
    case "amount-desc":
      return right.amount - left.amount;
    case "amount-asc":
      return left.amount - right.amount;
    default:
      return new Date(right.date) - new Date(left.date);
  }
}

function getWeekStartKey(entry) {
  const date = new Date(entry.date);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toISOString().slice(0, 10);
}

function formatCurrency(value) {
  return moneyFormatter.format(value);
}

function formatCompactCurrency(value) {
  return compactMoneyFormatter.format(value);
}

function formatDate(value) {
  return longDateFormatter.format(new Date(value));
}

function formatMonthLabel(value) {
  return shortMonthFormatter.format(new Date(`${value}-01`));
}

function formatWeekLabel(value) {
  return `Wk ${shortWeekFormatter.format(new Date(value))}`;
}
