import { createSelector } from "@reduxjs/toolkit";

export const selectExpenses = (state) => state.expenses.items;

export const selectExpenseTotal = createSelector([selectExpenses], (expenses) =>
  expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
);

export const selectExpenseCount = createSelector(
  [selectExpenses],
  (expenses) => expenses.length,
);

export const selectShouldShowPremium = createSelector(
  [selectExpenseTotal],
  (total) => total > 10000,
);
