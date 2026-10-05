import { createSlice } from "@reduxjs/toolkit";

function getPremiumKey() {
  const user = JSON.parse(
    sessionStorage.getItem("expense_tracker_user") || "null",
  );

  return user?.uid ? `expense_tracker_premium_${user.uid}` : null;
}

function getInitialPremiumState() {
  const key = getPremiumKey();

  return key ? localStorage.getItem(key) === "true" : false;
}

const premiumSlice = createSlice({
  name: "premium",

  initialState: {
    activated: getInitialPremiumState(),
  },

  reducers: {
    activatePremium(state) {
      state.activated = true;

      const key = getPremiumKey();

      if (key) {
        localStorage.setItem(key, "true");
      }
    },

    deactivatePremium(state) {
      state.activated = false;

      const key = getPremiumKey();

      if (key) {
        localStorage.removeItem(key);
      }
    },

    resetPremium(state) {
      state.activated = false;
    },
  },
});

export const { activatePremium, deactivatePremium, resetPremium } =
  premiumSlice.actions;

export default premiumSlice.reducer;
