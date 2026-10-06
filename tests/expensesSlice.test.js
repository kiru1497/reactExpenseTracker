import expensesReducer, {
  clearExpenses,
  createExpense,
  removeExpense,
} from "../src/features/expenses/expensesSlice";

describe("Expenses Slice", () => {
  // Test 3
  test("should clear all expenses", () => {
    const initialState = {
      items: [
        {
          id: "1",
          description: "Groceries",
          category: "Food",
          amount: 500,
        },
        {
          id: "2",
          description: "Bus ticket",
          category: "Transportation",
          amount: 100,
        },
      ],
      loading: false,
      saving: false,
      deletingIds: [],
      error: null,
    };

    const state = expensesReducer(initialState, clearExpenses());

    expect(state.items).toEqual([]);
    expect(state.error).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.saving).toBe(false);
  });

  // Test 4
  test("should add a new expense when createExpense succeeds", () => {
    const initialState = {
      items: [],
      loading: false,
      saving: true,
      deletingIds: [],
      error: null,
    };

    const newExpense = {
      id: "expense-1",
      description: "Lunch",
      category: "Food",
      amount: 250,
      date: "2026-10-06T09:00:00.000Z",
    };

    const action = createExpense.fulfilled(newExpense, "request-1", newExpense);

    const state = expensesReducer(initialState, action);

    expect(state.saving).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(newExpense);
  });

  // Test 5
  test("should remove an expense when removeExpense succeeds", () => {
    const initialState = {
      items: [
        {
          id: "expense-1",
          description: "Lunch",
          category: "Food",
          amount: 250,
        },
        {
          id: "expense-2",
          description: "Movie",
          category: "Entertainment",
          amount: 500,
        },
      ],
      loading: false,
      saving: false,
      deletingIds: ["expense-1"],
      error: null,
    };

    const action = removeExpense.fulfilled(
      "expense-1",
      "request-2",
      "expense-1",
    );

    const state = expensesReducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("expense-2");
    expect(state.deletingIds).toEqual([]);
  });
});
