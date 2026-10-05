import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "expense_tracker_id_token";
const USER_KEY = "expense_tracker_user";

function loadSession() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(sessionStorage.getItem(USER_KEY) || "null");

    if (!token || !user?.uid) {
      return {
        isAuthenticated: false,
        token: null,
        userId: null,
        user: null,
      };
    }

    return {
      isAuthenticated: true,
      token,
      userId: user.uid,
      user,
    };
  } catch {
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
    };
  }
}

const initialState = loadSession();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { idToken, localId, email, displayName } = action.payload;

      const user = {
        uid: localId,
        email,
        displayName: displayName || "",
      };

      state.isAuthenticated = true;
      state.token = idToken;
      state.userId = localId;
      state.user = user;

      sessionStorage.setItem(TOKEN_KEY, idToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.user = null;

      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
