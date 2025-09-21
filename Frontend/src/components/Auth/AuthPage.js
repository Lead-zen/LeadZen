import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { registerUser } from "../../services/api";
import MessageBox from "../MessageBox/MessageBox";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [messageBox, setMessageBox] = useState({ 
    isVisible: false, 
    type: "success", 
    message: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = "Email is invalid";
    if (!loginForm.password) newErrors.password = "Password is required";
    else if (loginForm.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupForm.firstName) newErrors.firstName = "First name is required";
    if (!signupForm.lastName) newErrors.lastName = "Last name is required";
    if (!signupForm.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) newErrors.email = "Email is invalid";
    if (!signupForm.password) newErrors.password = "Password is required";
    else if (signupForm.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!signupForm.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        setMessageBox({ 
          isVisible: true, 
          type: "success", 
          message: "Login successful! Redirecting to dashboard..." 
        });
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessageBox({ 
          isVisible: true, 
          type: "error", 
          message: result.message 
        });
      }
    } catch (error) {
      setMessageBox({ 
        isVisible: true, 
        type: "error", 
        message: error.message || "Login failed" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    setIsLoading(true);
    try {
      await registerUser(
        signupForm.firstName + " " + signupForm.lastName, 
        signupForm.email, 
        signupForm.password
      );
      setMessageBox({ 
        isVisible: true, 
        type: "success", 
        message: "Account created successfully! Please sign in." 
      });
      setIsSignUp(false);
    } catch (error) {
      setMessageBox({ 
        isVisible: true, 
        type: "error", 
        message: error.message || "Signup failed" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/oauth/google/login";
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button 
          className="close-button-top"
          onClick={() => window.history.back()}
        >
          ×
        </button>
        
        <div className="auth-header">
          <h1>
            {!isSignUp ? "Access Evecta's full power – sign in now" : "Sign up below"}
          </h1>
          <p>By continuing, you agree to our <a href="#" className="privacy-link">privacy policy</a>.</p>
        </div>

        <div className="auth-content">

          <div className="auth-forms">
            {/* Social Login Buttons */}
            <button 
              className="social-button google-button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>


            {!isSignUp ? (
              /* Sign In - Email and Password Form */
              <form onSubmit={handleLoginSubmit} className="signin-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    name="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      name="password"
                      className={`form-input ${errors.password ? "error" : ""}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button 
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            ) : (
              /* Sign Up - Full Form */
              <form onSubmit={handleSignupSubmit} className="signup-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={signupForm.firstName}
                      onChange={handleSignupChange}
                      className={`form-input ${errors.firstName ? "error" : ""}`}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={signupForm.lastName}
                      onChange={handleSignupChange}
                      className={`form-input ${errors.lastName ? "error" : ""}`}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
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
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
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
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            )}

            {/* Additional Options */}
            <div className="additional-options">
              <button 
                className="signup-toggle-button"
                onClick={() => setIsSignUp(!isSignUp)}
              >
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
