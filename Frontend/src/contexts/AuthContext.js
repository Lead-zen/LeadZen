import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, refreshToken, getMe, handleGoogleCallback } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setTokens = ({ access_token, refresh_token }) => {
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Auto-login if refresh token exists
  useEffect(() => {
    const tryAutoLogin = async () => {
      const token = localStorage.getItem("refreshToken");
      if (token) {
        try {
          const data = await refreshToken(token);
          setTokens(data);
          const me = await getMe(data.access_token);
          setUser(me);
        } catch {
          clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };
    tryAutoLogin();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setTokens(data);
      const me = await getMe(data.access_token);
      setUser(me);
      return { success: true, message: "Logged in successfully!" };
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await fetch("http://localhost:8000/authenticate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }
      return { success: true, message: "Account created successfully!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const googleLogin = async (code) => {
    try {
      const data = await handleGoogleCallback(code);
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        profile_pic: data.profile_pic
      });
      return { success: true, message: "Logged in with Google successfully!" };
    } catch (err) {
      return { success: false, message: err.message || "Google login failed" };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      try {
        await logoutUser(token);
      } catch {}
    }
    clearTokens();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
