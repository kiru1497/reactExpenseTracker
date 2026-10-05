import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../firebase/firebase";

// Helper to retrieve auth data and validate it
function getAuthCredentials(getState) {
  const { token, userId } = getState().auth;

  if (!token || !userId) {
    throw new Error("Please log in again.");
  }

  return { token, userId };
}

// Fetch expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, userId } = getAuthCredentials(getState);

      return await getExpenses(userId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add expense
export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expense, { getState, rejectWithValue }) => {
    try {
      const { token, userId } = getAuthCredentials(getState);

      return await addExpense(userId, token, expense);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Edit expense
export const editExpense = createAsyncThunk(
  "expenses/editExpense",
  async ({ id, expense }, { getState, rejectWithValue }) => {
    try {
      const { token, userId } = getAuthCredentials(getState);

      return await updateExpense(userId, token, id, expense);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete expense
export const removeExpense = createAsyncThunk(
  "expenses/removeExpense",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token, userId } = getAuthCredentials(getState);

      await deleteExpense(userId, token, id);

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  saving: false,
  deletingIds: [],
  error: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearExpenses(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
      state.saving = false;
      state.deletingIds = [];
    },

    clearExpenseError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load expenses.";
      })

      // Create
      .addCase(createExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Unable to add expense.";
      })

      // Update
      .addCase(editExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        state.saving = false;

        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Unable to update expense.";
      })

      // Delete
      .addCase(removeExpense.pending, (state, action) => {
        state.error = null;
        state.deletingIds.push(action.meta.arg);
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);

        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(removeExpense.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg,
        );

        state.error = action.payload || "Unable to delete expense.";
      });
  },
});

export const { clearExpenses, clearExpenseError } = expensesSlice.actions;

export default expensesSlice.reducer;
