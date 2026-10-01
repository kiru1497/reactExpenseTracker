const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const AUTH_URL = "https://identitytoolkit.googleapis.com/v1";

function getFirebaseError(errorCode) {
  const errors = {
    INVALID_ID_TOKEN: "Your session has expired. Please log in again.",
    USER_NOT_FOUND: "This account could not be found.",
    USER_DISABLED: "This account has been disabled.",
    EMAIL_NOT_FOUND: "The email address is not associated with an account.",
    EXPIRED_OOB_CODE:
      "This verification link has expired. Please request a new one.",
    INVALID_OOB_CODE:
      "This verification link is invalid or has already been used.",
    INVALID_CONTINUE_URI:
      "The redirect URL is invalid. Please check your Firebase configuration.",
    UNAUTHORIZED_DOMAIN: "This redirect domain is not authorized in Firebase.",
    OPERATION_NOT_ALLOWED:
      "This operation is not enabled for your Firebase project.",
    TOO_MANY_ATTEMPTS_TRY_LATER:
      "Too many attempts. Please wait and try again.",
    QUOTA_EXCEEDED:
      "The email sending limit has been reached. Try again later.",
    NETWORK_REQUEST_FAILED: "Network error. Check your internet connection.",
    INVALID_EMAIL: "The email address is invalid.",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
    INVALID_PASSWORD: "The password is incorrect.",
    EMAIL_EXISTS: "This email is already registered.",
    WEAK_PASSWORD: "Password should be at least 6 characters long.",
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

  const continueUrl = `${window.location.origin}/home?verified=1`;

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
