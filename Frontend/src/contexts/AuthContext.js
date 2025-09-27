// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axiosInstance"; // ✅ use axios instance with interceptor

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Try auto-login on mount
  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const res = await api.get("/authenticate/me");
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    tryAutoLogin();
  }, []);

  // Normal login (email/password)
  const login = async (email, password) => {
    try {
      await api.post("/authenticate/login", { email, password });
      const res = await api.get("/authenticate/me");
      setUser(res.data);
      return { success: true, message: "Logged in successfully!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || "Login failed" };
    }
  };

  // Signup
  const signup = async (username, email, password) => {
    try {
      await api.post("/authenticate/register", { username, email, password });
      return { success: true, message: "Account created successfully!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || "Signup failed" };
    }
  };

  // Google login (redirect handled fully by backend)
  const googleLogin = () => {
    window.location.href = "http://localhost:8000/oauth/google/login";
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/authenticate/logout");
    } catch {}
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, isAuthenticated, login, signup, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
