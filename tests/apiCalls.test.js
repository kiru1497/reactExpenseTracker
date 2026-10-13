import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../src/features/auth/authSlice";
import expensesReducer, {
  fetchExpenses,
  createExpense,
  editExpense,
  removeExpense,
} from "../src/features/expenses/expensesSlice";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../src/firebase/firebase";

jest.mock("../src/firebase/firebase", () => ({
  __esModule: true,
  getExpenses: jest.fn(),
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  signUpWithEmail: jest.fn(),
  signInWithEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
  getAccountInfo: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
}));

const AUTH_STATE = {
  isAuthenticated: true,
  token: "mock-id-token",
  userId: "user-123",
  user: {
    uid: "user-123",
    email: "test@example.com",
    displayName: "Test User",
  },
};

const EXPENSE = {
  amount: 250,
  description: "Lunch",
  category: "Food",
  date: "2026-10-13T10:00:00.000Z",
};

const SAVED_EXPENSE = {
  id: "expense-123",
  ...EXPENSE,
};

function makeStore(auth = AUTH_STATE) {
  return configureStore({
    reducer: {
      auth: authReducer,
      expenses: expensesReducer,
    },
    preloadedState: {
      auth,
      expenses: {
        items: [],
        loading: false,
        saving: false,
        deletingIds: [],
        error: null,
      },
    },
  });
}

describe("Mocked Firebase API calls from expense thunks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1
  test("fetchExpenses calls getExpenses with the user's ID and token", async () => {
    getExpenses.mockResolvedValue([SAVED_EXPENSE]);
    const store = makeStore();

    await expect(
      store.dispatch(fetchExpenses()).unwrap()
    ).resolves.toEqual([SAVED_EXPENSE]);

    expect(getExpenses).toHaveBeenCalledTimes(1);
    expect(getExpenses).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token"
    );
    expect(store.getState().expenses.items).toEqual([
      SAVED_EXPENSE,
    ]);
    expect(store.getState().expenses.loading).toBe(false);
  });

  // Test 2
  test("fetchExpenses stores an error when the API request fails", async () => {
    getExpenses.mockRejectedValue(
      new Error("Network unavailable")
    );

    const store = makeStore();

    await expect(
      store.dispatch(fetchExpenses()).unwrap()
    ).rejects.toBe("Network unavailable");

    expect(getExpenses).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token"
    );
    expect(store.getState().expenses.error).toBe(
      "Network unavailable"
    );
    expect(store.getState().expenses.loading).toBe(false);
  });

  // Test 3
  test("createExpense calls addExpense with the correct arguments", async () => {
    addExpense.mockResolvedValue(SAVED_EXPENSE);

    const store = makeStore();

    await expect(
      store.dispatch(createExpense(EXPENSE)).unwrap()
    ).resolves.toEqual(SAVED_EXPENSE);

    expect(addExpense).toHaveBeenCalledTimes(1);
    expect(addExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      EXPENSE
    );
    expect(store.getState().expenses.items).toEqual([
      SAVED_EXPENSE,
    ]);
    expect(store.getState().expenses.saving).toBe(false);
  });

  // Test 4
  test("createExpense stores an error when adding an expense fails", async () => {
    addExpense.mockRejectedValue(
      new Error("Could not save expense")
    );

    const store = makeStore();

    await expect(
      store.dispatch(createExpense(EXPENSE)).unwrap()
    ).rejects.toBe("Could not save expense");

    expect(addExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      EXPENSE
    );
    expect(store.getState().expenses.error).toBe(
      "Could not save expense"
    );
    expect(store.getState().expenses.saving).toBe(false);
  });

  // Test 5
  test("editExpense calls updateExpense with the expense ID and updated data", async () => {
    const updatedExpense = {
      id: "expense-123",
      ...EXPENSE,
      amount: 300,
      description: "Lunch with a drink",
    };

    const updatedData = {
      ...EXPENSE,
      amount: 300,
      description: "Lunch with a drink",
    };

    updateExpense.mockResolvedValue(updatedExpense);

    const store = makeStore();

    await expect(
      store.dispatch(
        editExpense({
          id: "expense-123",
          expense: updatedData,
        })
      ).unwrap()
    ).resolves.toEqual(updatedExpense);

    expect(updateExpense).toHaveBeenCalledTimes(1);
    expect(updateExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      "expense-123",
      updatedData
    );
  });

  // Test 6
  test("editExpense stores an error when updating an expense fails", async () => {
    updateExpense.mockRejectedValue(
      new Error("Update failed")
    );

    const store = makeStore();

    await expect(
      store.dispatch(
        editExpense({
          id: "expense-123",
          expense: EXPENSE,
        })
      ).unwrap()
    ).rejects.toBe("Update failed");

    expect(updateExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      "expense-123",
      EXPENSE
    );
    expect(store.getState().expenses.error).toBe(
      "Update failed"
    );
    expect(store.getState().expenses.saving).toBe(false);
  });

  // Test 7
  test("removeExpense calls deleteExpense and removes the expense from state", async () => {
    deleteExpense.mockResolvedValue(null);

    const store = makeStore();

    // Seed the store with an existing expense.
    store.dispatch({
      type: "expenses/fetchExpenses/fulfilled",
      payload: [SAVED_EXPENSE],
      meta: {
        requestId: "seed-request",
        requestStatus: "fulfilled",
      },
    });

    await expect(
      store.dispatch(removeExpense("expense-123")).unwrap()
    ).resolves.toBe("expense-123");

    expect(deleteExpense).toHaveBeenCalledTimes(1);
    expect(deleteExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      "expense-123"
    );
    expect(store.getState().expenses.items).toEqual([]);
    expect(store.getState().expenses.deletingIds).toEqual([]);
  });

  // Test 8
  test("removeExpense stores an error when deleting an expense fails", async () => {
    deleteExpense.mockRejectedValue(
      new Error("Delete failed")
    );

    const store = makeStore();

    await expect(
      store.dispatch(removeExpense("expense-123")).unwrap()
    ).rejects.toBe("Delete failed");

    expect(deleteExpense).toHaveBeenCalledWith(
      "user-123",
      "mock-id-token",
      "expense-123"
    );
    expect(store.getState().expenses.error).toBe(
      "Delete failed"
    );
    expect(store.getState().expenses.deletingIds).toEqual([]);
  });

  // Test 9
  test("fetchExpenses does not call Firebase when authentication credentials are missing", async () => {
    const unauthenticatedState = {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
    };

    const store = makeStore(unauthenticatedState);

    await expect(
      store.dispatch(fetchExpenses()).unwrap()
    ).rejects.toBe("Please log in again.");

    expect(getExpenses).not.toHaveBeenCalled();
  });

  // Test 10
  test("createExpense does not call Firebase when authentication credentials are missing", async () => {
    const unauthenticatedState = {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
    };

    const store = makeStore(unauthenticatedState);

    await expect(
      store.dispatch(createExpense(EXPENSE)).unwrap()
    ).rejects.toBe("Please log in again.");

    expect(addExpense).not.toHaveBeenCalled();
  });
});