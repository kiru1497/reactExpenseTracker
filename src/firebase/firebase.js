const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1/accounts";

async function authRequest(endpoint, payload) {
  if (!API_KEY) {
    throw new Error("Firebase is not configured. Check your .env file.");
  }

  let response;

  try {
    response = await fetch(`${AUTH_BASE}:${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to connect. Check your internet connection.");
  }

  const data = await response.json();

  if (!response.ok) {
    const code = data?.error?.message;

    const errorMessages = {
      EMAIL_EXISTS: "An account with this email already exists.",

      INVALID_EMAIL: "Enter a valid email address.",

      INVALID_LOGIN_CREDENTIALS:
        "Incorrect email or password. Please try again.",

      EMAIL_NOT_FOUND: "No account was found with this email.",

      INVALID_PASSWORD: "Incorrect email or password. Please try again.",

      USER_DISABLED: "This account has been disabled.",

      TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again later.",

      WEAK_PASSWORD: "Choose a stronger password.",

      OPERATION_NOT_ALLOWED: "Email/password sign-in is not enabled.",

      API_KEY_INVALID: "The Firebase API key is invalid.",
    };

    throw new Error(
      errorMessages[code] || "Authentication failed. Please try again.",
    );
  }

  return data;
}

export async function signUpWithEmail({
  email,
  password,
  firstName,
  lastName,
}) {
  const account = await authRequest("signUp", {
    email,
    password,
    returnSecureToken: true,
  });

  await authRequest("update", {
    idToken: account.idToken,
    displayName: `${firstName} ${lastName}`.trim(),
    returnSecureToken: true,
  });

  return account;
}

export async function signInWithEmail({ email, password }) {
  return authRequest("signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}
