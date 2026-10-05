import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import themeReducer from "../features/theme/themeSlice";
import premiumReducer from "../features/premium/premiumSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    theme: themeReducer,
    premium: premiumReducer,
  },
});
