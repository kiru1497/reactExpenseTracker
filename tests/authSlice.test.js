import authReducer, { login, logout } from "../src/features/auth/authSlice";

describe("Auth Slice", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // Test 1
  test("should authenticate the user when login is dispatched", () => {
    const initialState = {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
    };

    const action = login({
      idToken: "test-token",
      localId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    });

    const state = authReducer(initialState, action);

    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("test-token");
    expect(state.userId).toBe("user123");
    expect(state.user.email).toBe("test@example.com");
  });

  // Test 2
  test("should log the user out and clear authentication data", () => {
    const loggedInState = {
      isAuthenticated: true,
      token: "test-token",
      userId: "user123",
      user: {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      },
    };

    const state = authReducer(loggedInState, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.userId).toBeNull();
    expect(state.user).toBeNull();
  });
});
