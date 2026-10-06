import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Expenses from "../src/Pages/Expenses";
import ExpenseTopbar from "../src/components/Expenses/ExpenseTopbar";
import ExpenseModal from "../src/components/UI/ExpenseModal";

import authReducer from "../src/features/auth/authSlice";
import expensesReducer from "../src/features/expenses/expensesSlice";
import premiumReducer from "../src/features/premium/premiumSlice";
import themeReducer from "../src/features/theme/themeSlice";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../src/firebase/firebase";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

jest.mock("../src/firebase/firebase", () => ({
  __esModule: true,
  getExpenses: jest.fn(),
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
}));

jest.mock("../src/components/Expenses/ExpenseSidebar", () => ({
  __esModule: true,
  default: () => <aside>Sidebar</aside>,
}));

jest.mock("../src/components/Expenses/ExpenseSummary", () => ({
  __esModule: true,
  default: ({ total, count }) => (
    <div>
      <span data-testid="expense-total">{total}</span>

      <span data-testid="expense-count">{count}</span>
    </div>
  ),
}));

jest.mock("../src/components/Expenses/PremiumControls", () => ({
  __esModule: true,
  default: () => <div>Premium Controls</div>,
}));

jest.mock("../src/components/Expenses/ExpenseTable", () => ({
  __esModule: true,

  default: ({ expenses, onDelete }) => (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <span>{expense.description}</span>

          <button type="button" onClick={() => onDelete(expense.id)}>
            Delete {expense.description}
          </button>
        </div>
      ))}
    </div>
  ),
}));

// -----------------------------------------------------------------------------
// Test data
// -----------------------------------------------------------------------------

const expenses = [
  {
    id: "expense-1",
    description: "Grocery shopping",
    category: "Groceries",
    amount: 1500,
    date: "2026-10-05T10:00:00.000Z",
  },
  {
    id: "expense-2",
    description: "Movie tickets",
    category: "Entertainment",
    amount: 800,
    date: "2026-10-04T10:00:00.000Z",
  },
];

// -----------------------------------------------------------------------------
// Store helpers
// -----------------------------------------------------------------------------

function getPreloadedState(items = expenses) {
  return {
    auth: {
      isAuthenticated: true,
      token: "test-token",
      userId: "user123",
      user: {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      },
    },

    expenses: {
      items,
      loading: false,
      saving: false,
      deletingIds: [],
      error: null,
    },

    premium: {
      activated: false,
    },

    theme: {
      mode: "light",
    },
  };
}

function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      expenses: expensesReducer,
      premium: premiumReducer,
      theme: themeReducer,
    },

    preloadedState,
  });
}

// -----------------------------------------------------------------------------
// Global test setup
// -----------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();

  window.confirm = jest.fn(() => true);

  getExpenses.mockResolvedValue([]);
});

// -----------------------------------------------------------------------------
// Test 1
// -----------------------------------------------------------------------------

test("1. user can type into the expense search field", async () => {
  const user = userEvent.setup();

  function TestWrapper() {
    const [search, setSearch] = React.useState("");

    return (
      <ExpenseTopbar
        search={search}
        setSearch={setSearch}
        onAddExpense={jest.fn()}
      />
    );
  }

  render(<TestWrapper />);

  const searchInput = screen.getByRole("searchbox", {
    name: "Search expenses",
  });

  await user.type(searchInput, "Groceries");

  expect(searchInput).toHaveValue("Groceries");
});

// -----------------------------------------------------------------------------
// Test 2
// -----------------------------------------------------------------------------

test("2. user can click the Add Expense button", async () => {
  const user = userEvent.setup();

  const onAddExpense = jest.fn();

  render(
    <ExpenseTopbar
      search=""
      setSearch={jest.fn()}
      onAddExpense={onAddExpense}
    />,
  );

  const addExpenseButton = screen.getByRole("button", {
    name: "Add Expense",
  });

  await user.click(addExpenseButton);

  expect(onAddExpense).toHaveBeenCalledTimes(1);
});

// -----------------------------------------------------------------------------
// Test 3
// -----------------------------------------------------------------------------

test("3. user can enter expense details in the modal", async () => {
  const user = userEvent.setup();

  render(
    <ExpenseModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} />,
  );

  const amount = screen.getByLabelText("Amount (₹)");
  const description = screen.getByLabelText("Description");
  const category = screen.getByLabelText("Category");

  await user.type(amount, "1500");
  await user.type(description, "Grocery shopping");
  await user.selectOptions(category, "Groceries");

  expect(amount).toHaveValue(1500);
  expect(description).toHaveValue("Grocery shopping");
  expect(category).toHaveValue("Groceries");
});

// -----------------------------------------------------------------------------
// Test 4
// -----------------------------------------------------------------------------

test("4. user can submit a valid expense", async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValue();

  render(
    <ExpenseModal isOpen={true} onClose={jest.fn()} onSubmit={onSubmit} />,
  );

  await user.type(screen.getByLabelText("Amount (₹)"), "1200");

  await user.type(screen.getByLabelText("Description"), "Dinner");

  await user.selectOptions(screen.getByLabelText("Category"), "Food");

  await user.click(
    screen.getByRole("button", {
      name: "Add Expense",
    }),
  );

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      amount: 1200,
      description: "Dinner",
      category: "Food",
    });
  });
});

// -----------------------------------------------------------------------------
// Test 5
// -----------------------------------------------------------------------------

test("5. clicking Add Expense opens the modal in the connected Expenses page", async () => {
  const user = userEvent.setup();

  getExpenses.mockResolvedValue([]);

  const store = createTestStore(getPreloadedState([]));

  render(
    <Provider store={store}>
      <Expenses />
    </Provider>,
  );

  await waitFor(() => {
    expect(
      screen.getByRole("heading", {
        name: "Expenses",
      }),
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole("button", {
      name: "Add Expense",
    }),
  );

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  expect(
    screen.getByRole("heading", {
      name: "Add New Expense",
    }),
  ).toBeInTheDocument();
});

// -----------------------------------------------------------------------------
// Test 6
// -----------------------------------------------------------------------------

test("6. submitting a new expense updates Redux state", async () => {
  const user = userEvent.setup();

  getExpenses.mockResolvedValue([]);

  const newExpense = {
    id: "expense-3",
    description: "Dinner",
    category: "Food",
    amount: 1200,
    date: "2026-10-06T10:00:00.000Z",
  };

  addExpense.mockResolvedValue(newExpense);

  const store = createTestStore(getPreloadedState([]));

  render(
    <Provider store={store}>
      <Expenses />
    </Provider>,
  );

  await waitFor(() => {
    expect(
      screen.getByRole("heading", {
        name: "Expenses",
      }),
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole("button", {
      name: "Add Expense",
    }),
  );

  const modal = screen.getByRole("dialog");

  await user.type(within(modal).getByLabelText("Amount (₹)"), "1200");

  await user.type(within(modal).getByLabelText("Description"), "Dinner");

  await user.selectOptions(within(modal).getByLabelText("Category"), "Food");

  await user.click(
    within(modal).getByRole("button", {
      name: "Add Expense",
    }),
  );

  await waitFor(() => {
    const state = store.getState();

    expect(state.expenses.items).toHaveLength(1);

    expect(state.expenses.items[0]).toEqual(newExpense);
  });
});

// -----------------------------------------------------------------------------
// Test 7
// -----------------------------------------------------------------------------

test("7. searching filters expenses displayed by the connected page", async () => {
  const user = userEvent.setup();

  getExpenses.mockResolvedValue(expenses);

  const store = createTestStore(getPreloadedState(expenses));

  render(
    <Provider store={store}>
      <Expenses />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument();
  });

  expect(screen.getByText("Movie tickets")).toBeInTheDocument();

  const searchInput = screen.getByRole("searchbox", {
    name: "Search expenses",
  });

  await user.type(searchInput, "Grocery");

  expect(screen.getByText("Grocery shopping")).toBeInTheDocument();

  expect(screen.queryByText("Movie tickets")).not.toBeInTheDocument();
});

// -----------------------------------------------------------------------------
// Test 8
// -----------------------------------------------------------------------------

test("8. user can delete an expense after confirming the action", async () => {
  const user = userEvent.setup();

  getExpenses.mockResolvedValue(expenses);

  deleteExpense.mockResolvedValue();

  window.confirm = jest.fn(() => true);

  const store = createTestStore(getPreloadedState(expenses));

  render(
    <Provider store={store}>
      <Expenses />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole("button", {
      name: "Delete Grocery shopping",
    }),
  );

  expect(window.confirm).toHaveBeenCalledWith(
    "Are you sure you want to delete this expense?",
  );

  await waitFor(() => {
    expect(deleteExpense).toHaveBeenCalledWith(
      "user123",
      "test-token",
      "expense-1",
    );
  });
});

// -----------------------------------------------------------------------------
// Test 9
// -----------------------------------------------------------------------------

test("9. deleting an expense removes it from Redux state", async () => {
  const user = userEvent.setup();

  getExpenses.mockResolvedValue(expenses);

  deleteExpense.mockResolvedValue();

  window.confirm = jest.fn(() => true);

  const store = createTestStore(getPreloadedState(expenses));

  render(
    <Provider store={store}>
      <Expenses />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole("button", {
      name: "Delete Grocery shopping",
    }),
  );

  await waitFor(() => {
    expect(store.getState().expenses.items).toEqual([expenses[1]]);
  });
});

// -----------------------------------------------------------------------------
// Test 10
// -----------------------------------------------------------------------------

test("10. submitting an invalid amount displays a validation error", async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn();

  render(
    <ExpenseModal isOpen={true} onClose={jest.fn()} onSubmit={onSubmit} />,
  );

  await user.type(screen.getByLabelText("Amount (₹)"), "0");

  await user.type(screen.getByLabelText("Description"), "Invalid expense");

  await user.click(
    screen.getByRole("button", {
      name: "Add Expense",
    }),
  );

  expect(
    screen.getByText("Enter a valid amount greater than zero."),
  ).toBeInTheDocument();

  expect(onSubmit).not.toHaveBeenCalled();
});
