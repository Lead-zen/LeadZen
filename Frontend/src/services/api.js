const API_URL = "http://localhost:8000/authenticate";

// Login
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Login failed");
  }
  return await res.json(); // returns { access_token, refresh_token, token_type }
};

// Register
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Signup failed");
  }
  return await res.json(); // returns the registered user object
};

// Refresh token
export const refreshToken = async (refresh_token) => {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Token refresh failed");
  }
  return await res.json(); // returns { access_token, refresh_token, token_type }
};

// Logout
export const logoutUser = async (refresh_token) => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Logout failed");
  }
  return await res.json(); // returns success message
};

// Get current user
export const getMe = async (access_token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Fetching user failed");
  }
  return await res.json(); // returns the current user object
};

// Google OAuth
export const getGoogleLoginUrl = () => {
  return "http://localhost:8000/oauth/google/login";
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  const res = await fetch(`http://localhost:8000/oauth/google/callback?code=${code}`, {
    method: "GET",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Google login failed");
  }
  return await res.json(); // returns user data and tokens
};