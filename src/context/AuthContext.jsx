import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "expense_tracker_id_token";
const USER_KEY = "expense_tracker_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem(USER_KEY);

    return saved ? JSON.parse(saved) : null;
  });

  function login(authData) {
    const userData = {
      email: authData.email,
      displayName: authData.displayName || "",
      localId: authData.localId,
    };

    sessionStorage.setItem(TOKEN_KEY, authData.idToken);

    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));

    setToken(authData.idToken);
    setUser(userData);
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
