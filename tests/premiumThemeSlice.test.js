import premiumReducer, {
  activatePremium,
  deactivatePremium,
} from "../src/features/premium/premiumSlice";

import themeReducer, { toggleTheme } from "../src/features/theme/themeSlice";

describe("Premium Slice", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    sessionStorage.setItem(
      "expense_tracker_user",
      JSON.stringify({
        uid: "user123",
        email: "test@example.com",
      }),
    );
  });

  // Test 6
  test("should activate premium", () => {
    const initialState = {
      activated: false,
    };

    const state = premiumReducer(initialState, activatePremium());

    expect(state.activated).toBe(true);

    expect(localStorage.getItem("expense_tracker_premium_user123")).toBe(
      "true",
    );
  });

  // Test 7
  test("should deactivate premium", () => {
    localStorage.setItem("expense_tracker_premium_user123", "true");

    const initialState = {
      activated: true,
    };

    const state = premiumReducer(initialState, deactivatePremium());

    expect(state.activated).toBe(false);

    expect(localStorage.getItem("expense_tracker_premium_user123")).toBeNull();
  });
});

describe("Theme Slice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 8
  test("should toggle the theme from light to dark", () => {
    const initialState = {
      mode: "light",
    };

    const state = themeReducer(initialState, toggleTheme());

    expect(state.mode).toBe("dark");
    expect(localStorage.getItem("expense_tracker_theme")).toBe("dark");
  });
});
