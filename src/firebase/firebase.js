const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const AUTH_URL = "https://identitytoolkit.googleapis.com/v1";

function getFirebaseError(errorCode) {
  const errors = {
    INVALID_ID_TOKEN: "Your session has expired. Please log in again.",
    USER_NOT_FOUND: "This account could not be found.",
    USER_DISABLED: "This account has been disabled.",
    EMAIL_NOT_FOUND: "No account was found with this email address.",
    EXPIRED_OOB_CODE:
      "This password reset link has expired. Please request a new one.",
    INVALID_OOB_CODE:
      "This password reset link is invalid or has already been used.",
    INVALID_CONTINUE_URI:
      "The redirect URL is invalid. Please check your Firebase configuration.",
    UNAUTHORIZED_DOMAIN: "This redirect domain is not authorized in Firebase.",
    OPERATION_NOT_ALLOWED: "Password reset is not enabled for this project.",
    TOO_MANY_ATTEMPTS_TRY_LATER:
      "Too many attempts. Please wait and try again.",
    RESET_PASSWORD_EXCEED_LIMIT:
      "The password reset limit has been reached. Try again later.",
    QUOTA_EXCEEDED:
      "The email sending limit has been reached. Try again later.",
    NETWORK_REQUEST_FAILED: "Network error. Check your internet connection.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
    INVALID_PASSWORD: "The password is incorrect.",
    EMAIL_EXISTS: "This email is already registered.",
    WEAK_PASSWORD: "Your password must contain at least 6 characters.",
  };

  return errors[errorCode] || "Something went wrong. Please try again.";
}

async function firebaseRequest(endpoint, body) {
  if (!API_KEY) {
    throw new Error("Firebase API key is missing. Check your .env file.");
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
    throw new Error(
      "Unable to connect to Firebase. Check your internet connection.",
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const code =
      data?.error?.message?.split(" : ")[0] ||
      data?.error?.message ||
      "UNKNOWN_ERROR";

    throw new Error(getFirebaseError(code));
  }

  return data;
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  return firebaseRequest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

// Sign up with email and password
export async function signUpWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  return firebaseRequest("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });
}

// Send email verification
export async function sendVerificationEmail(idToken) {
  if (!idToken) {
    throw new Error("You must log in before requesting email verification.");
  }

  const continueUrl = `${window.location.origin}/dashboard?verified=1`;

  return firebaseRequest("accounts:sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken,
    continueUrl,
  });
}

// Retrieve account information
export async function getAccountInfo(idToken) {
  if (!idToken) {
    throw new Error("Authentication token is missing.");
  }

  const data = await firebaseRequest("accounts:lookup", { idToken });

  if (!data.users || data.users.length === 0) {
    throw new Error("Unable to retrieve account information.");
  }

  return data.users[0];
}

// Send password reset email
export async function sendPasswordResetEmail(email) {
  const normalizedEmail = email?.trim();

  if (!normalizedEmail) {
    throw new Error("Please enter your email address.");
  }

  return firebaseRequest("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email: normalizedEmail,
  });
}

// Confirm password reset
export async function confirmPasswordReset(oobCode, newPassword) {
  if (!oobCode) {
    throw new Error(
      "Password reset code is missing. Please open the link from your email.",
    );
  }

  if (!newPassword) {
    throw new Error("Please enter your new password.");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  return firebaseRequest("accounts:resetPassword", {
    oobCode,
    newPassword,
  });
}

// -----------------------------
// Realtime Database operations
// -----------------------------

function getDatabaseUrl(path, idToken) {
  if (!DATABASE_URL) {
    throw new Error("Firebase database URL is missing. Check your .env file.");
  }

  if (!idToken) {
    throw new Error("Authentication token is missing. Please log in again.");
  }

  const baseUrl = DATABASE_URL.replace(/\/+$/, "");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");

  return `${baseUrl}/${encodedPath}.json?auth=${encodeURIComponent(idToken)}`;
}

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
    throw new Error(
      "Unable to connect to Firebase. Check your internet connection.",
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorCode =
      typeof data?.error === "string"
        ? data.error
        : data?.error?.message || "UNKNOWN_ERROR";

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Access denied. Your session may have expired, or database rules may need checking.",
      );
    }

    throw new Error(`Database request failed: ${errorCode}`);
  }

  return data;
}

// Fetch all expenses belonging to the current user
export async function getExpenses(uid, idToken) {
  if (!uid) {
    throw new Error("User ID is missing.");
  }

  const data = await databaseRequest(`expenses/${uid}`, idToken, "GET");

  if (!data) return [];

  return Object.entries(data).map(([id, expense]) => ({
    id,
    ...expense,
  }));
}

// Add a new expense
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

// Update an existing expense
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

// Delete an expense
export async function deleteExpense(uid, idToken, expenseId) {
  if (!uid || !expenseId) {
    throw new Error("User ID or expense ID is missing.");
  }

  return databaseRequest(`expenses/${uid}/${expenseId}`, idToken, "DELETE");
}
