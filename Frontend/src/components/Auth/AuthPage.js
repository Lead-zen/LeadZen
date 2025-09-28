// src/pages/AuthPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MessageBox from "../MessageBox/MessageBox";
import { Eye, EyeOff } from "lucide-react";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, googleLogin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [messageBox, setMessageBox] = useState({ isVisible: false, type: "success", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // Validation
  // -------------------------------
  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    if (!loginForm.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupForm.username) newErrors.username = "Username is required";
    if (!signupForm.email) newErrors.email = "Email is required";
    if (!signupForm.password) newErrors.password = "Password is required";
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      setMessageBox({ isVisible: true, type: "success", message: result.message });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setMessageBox({ isVisible: true, type: "error", message: result.message });
    }
    setIsLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    const result = await signup(signupForm.username, signupForm.email, signupForm.password);
    if (result.success) {
      setMessageBox({ isVisible: true, type: "success", message: result.message });
      setIsSignUp(false);
    } else {
      setMessageBox({ isVisible: true, type: "error", message: result.message });
    }
    setIsLoading(false);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="close-button-top" onClick={() => window.history.back()}>
          ×
        </button>

        <div className="auth-header">
          <h1>{!isSignUp ? "Access Evecta's full power – sign in now" : "Sign up below"}</h1>
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="privacy-link">
              privacy policy
            </a>.
          </p>
        </div>

        <div className="auth-content">
          <div className="auth-forms">
            {/* Google Login Button */}
            <button className="social-button google-button" onClick={googleLogin} disabled={isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Or Separator */}
            <div className="or-separator">
              <span className="or-text">{!isSignUp ? "or log in with" : "or sign up with"}</span>
            </div>

            {/* Sign In / Sign Up Forms */}
            {!isSignUp ? (
              <form onSubmit={handleLoginSubmit} className="signin-form">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className={`form-input ${errors.password ? "error" : ""}`}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="signup-form">
                <div className="form-group">
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                    className={`form-input ${errors.username ? "error" : ""}`}
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      className={`form-input ${errors.password ? "error" : ""}`}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Create Account"}
                </button>
              </form>
            )}

            <div className="additional-options">
              <button className="signup-toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
                {!isSignUp ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <MessageBox
        type={messageBox.type}
        message={messageBox.message}
        isVisible={messageBox.isVisible}
        onClose={() => setMessageBox({ isVisible: false })}
      />
    </div>
  );
};

export default AuthPage;
