const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const AUTH_URL = "https://identitytoolkit.googleapis.com/v1";

// Firebase error handler
export function getFirebaseError(code) {
  const errors = {
    EMAIL_EXISTS: "This email is already registered.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PASSWORD: "Password must be at least 6 characters.",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
    EMAIL_NOT_FOUND: "No account found with this email.",
    INVALID_CREDENTIAL: "Invalid email or password.",
    USER_DISABLED: "This account has been disabled.",
    WEAK_PASSWORD: "Password must be at least 6 characters.",
    MISSING_EMAIL: "Please enter your email address.",
    MISSING_PASSWORD: "Please enter your password.",
    EXPIRED_OOB_CODE: "This link has expired. Please request a new one.",
    INVALID_OOB_CODE: "This link is invalid or has already been used.",
    INVALID_ID_TOKEN: "Your session has expired. Please log in again.",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again later.",
    OPERATION_NOT_ALLOWED: "This operation is not allowed.",
  };

  return errors[code] || "Something went wrong. Please try again.";
}

// Reusable Firebase Authentication request
async function firebaseRequest(endpoint, body) {
  if (!API_KEY) {
    throw new Error("Firebase API key is missing.");
  }

  let response;

  try {
    response = await fetch(`${AUTH_URL}/${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to connect to Firebase.");
  }

  const data = await response.json();

  if (!response.ok) {
    const code = data?.error?.message?.split(" : ")[0];
    throw new Error(getFirebaseError(code));
  }

  return data;
}

// Sign up
export async function signUpWithEmail(email, password) {
  return firebaseRequest("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });
}

// Sign in
export async function signInWithEmail(email, password) {
  return firebaseRequest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

// Get account information
export async function getAccountInfo(idToken) {
  const data = await firebaseRequest("accounts:lookup", {
    idToken,
  });

  return data.users?.[0] ?? null;
}

// Send password reset email
export async function sendPasswordResetEmail(email) {
  return firebaseRequest("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });
}

// Confirm password reset
export async function confirmPasswordReset(oobCode, newPassword) {
  return firebaseRequest("accounts:resetPassword", {
    oobCode,
    newPassword,
  });
}

// Send email verification
export async function sendVerificationEmail(idToken) {
  return firebaseRequest("accounts:sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken,
  });
}

// Database URL builder
function getDatabaseUrl(path, idToken) {
  if (!DATABASE_URL) {
    throw new Error("Firebase database URL is missing.");
  }

  if (!idToken) {
    throw new Error("Authentication token is missing.");
  }

  const baseUrl = DATABASE_URL.replace(/\/+$/, "");

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");

  return `${baseUrl}/${encodedPath}.json?auth=${encodeURIComponent(idToken)}`;
}

// Reusable Firebase Realtime Database request
async function databaseRequest(path, idToken, method = "GET", body) {
  const url = getDatabaseUrl(path, idToken);

  let response;

  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("Unable to connect to Firebase.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Access denied. Your session may have expired.");
    }

    throw new Error(
      typeof data?.error === "string" ? data.error : "Database request failed.",
    );
  }

  return data;
}

// Fetch expenses
export async function getExpenses(uid, idToken) {
  if (!uid) {
    throw new Error("User ID is missing.");
  }

  const data = await databaseRequest(`expenses/${uid}`, idToken);

  if (!data) return [];

  return Object.entries(data).map(([id, expense]) => ({
    id,
    ...expense,
  }));
}

// Add expense
export async function addExpense(uid, idToken, expense) {
  if (!uid) {
    throw new Error("User ID is missing.");
  }

  const result = await databaseRequest(
    `expenses/${uid}`,
    idToken,
    "POST",
    expense,
  );

  return {
    id: result.name,
    ...expense,
  };
}

// Update expense
export async function updateExpense(uid, idToken, expenseId, expense) {
  if (!uid || !expenseId) {
    throw new Error("User ID or expense ID is missing.");
  }

  await databaseRequest(
    `expenses/${uid}/${expenseId}`,
    idToken,
    "PUT",
    expense,
  );

  return {
    id: expenseId,
    ...expense,
  };
}

// Delete expense
export async function deleteExpense(uid, idToken, expenseId) {
  if (!uid || !expenseId) {
    throw new Error("User ID or expense ID is missing.");
  }

  return databaseRequest(`expenses/${uid}/${expenseId}`, idToken, "DELETE");
}
