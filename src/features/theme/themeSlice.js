import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "expense_tracker_theme";

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  return savedTheme === "dark" ? "dark" : "light";
}

const themeSlice = createSlice({
  name: "theme",

  initialState: {
    mode: getInitialTheme(),
  },

  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";

      localStorage.setItem(THEME_KEY, state.mode);
    },

    setTheme(state, action) {
      state.mode = action.payload;

      localStorage.setItem(THEME_KEY, action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;