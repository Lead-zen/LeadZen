import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const GoogleCallback = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setStatus("error");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        if (!code) {
          setStatus("error");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        // Call the Google login function
        const result = await googleLogin(code);
        
        if (result.success) {
          setStatus("success");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setStatus("error");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleGoogleCallback();
  }, [googleLogin, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="callback-content">
            {status === "processing" && (
              <>
                <div className="loading-spinner large"></div>
                <h2>Processing Google Sign In...</h2>
                <p>Please wait while we complete your authentication.</p>
              </>
            )}
            
            {status === "success" && (
              <>
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
                  </svg>
                </div>
                <h2>Success!</h2>
                <p>You have been successfully signed in with Google.</p>
                <p>Redirecting to dashboard...</p>
              </>
            )}
            
            {status === "error" && (
              <>
                <div className="error-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>Authentication Failed</h2>
                <p>There was an error signing you in with Google.</p>
                <p>Redirecting to home page...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
