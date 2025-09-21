import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { registerUser } from "../../services/api";
import MessageBox from "../../components/MessageBox/MessageBox";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [messageBox, setMessageBox] = useState({ isVisible: false, type: "success", message: "" });

  const handleLoginChange = (e) => setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSignupChange = (e) => setSignupForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.email, loginForm.password);
    setMessageBox({ isVisible: true, type: result.success ? "success" : "error", message: result.message });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(signupForm.firstName + signupForm.lastName, signupForm.email, signupForm.password);
      setMessageBox({ isVisible: true, type: "success", message: "Account created successfully!" });
      setActiveTab("login");
    } catch (err) {
      setMessageBox({ isVisible: true, type: "error", message: err.message });
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Account</h1>
        <div className="auth-tabs">
          <button className={activeTab === "login" ? "active" : ""} onClick={() => setActiveTab("login")}>Login</button>
          <button className={activeTab === "signup" ? "active" : ""} onClick={() => setActiveTab("signup")}>Sign Up</button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <input name="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} />
            <button type="submit">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <input name="firstName" placeholder="First Name" value={signupForm.firstName} onChange={handleSignupChange} />
            <input name="lastName" placeholder="Last Name" value={signupForm.lastName} onChange={handleSignupChange} />
            <input name="email" placeholder="Email" value={signupForm.email} onChange={handleSignupChange} />
            <input type="password" name="password" placeholder="Password" value={signupForm.password} onChange={handleSignupChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupForm.confirmPassword} onChange={handleSignupChange} />
            <button type="submit">Sign Up</button>
          </form>
        )}

      </div>

      <MessageBox type={messageBox.type} message={messageBox.message} isVisible={messageBox.isVisible} onClose={() => setMessageBox({ isVisible: false })} />
    </div>
  );
};

export default SettingsPage;
