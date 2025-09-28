import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MessageBox from "../../components/MessageBox/MessageBox";
import { Info, BookOpen, LogIn, LogOut, UserCheck, UserLock, CompassIcon, DraftingCompassIcon, LucideCompass, AtomIcon, NewspaperIcon, MessageSquareShare } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [messageBox, setMessageBox] = useState({ isVisible: false, type: "success", message: "" });

  const menuItems = [
    { id: "about", label: "Discover", path: "/about", icon: AtomIcon },
    { id: "blog", label: "Blog", path: "/blog", icon:NewspaperIcon },
  ];

  const handleNavigation = (path) => navigate(path);
  const handleAddClick = () => navigate("/chat");

  // LOGOUT
  const handleLogout = async () => {
    await logout();
    setMessageBox({ isVisible: true, type: "success", message: "Logged out successfully!" });
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-text">Evecta</div>
      </div>

      <div className="sidebar-middle">
        <div className="add-section"><button className={`add-button ${location.pathname === "/chat" ? "active" : ""}`} onClick={handleAddClick}><MessageSquareShare className="add-icon" /><span className="add-label">Chat</span></button></div>
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button key={item.id} className={`nav-item ${location.pathname === item.path ? "active" : ""}`} onClick={() => handleNavigation(item.path)}>
                <div className="nav-icon-container">
                  <IconComponent className="nav-icon" />
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="signin-section">
        {user ? (
          <div className="signin-container">
            <button className={`signin-button ${location.pathname === "/logout" ? "active" : ""}`} onClick={handleLogout}>
              <LogOut className="signin-icon" />
            </button>
            <span className="signin-label">Logout</span>
          </div>
        ) : (
          <div className="signin-container">
            <button className={`signin-button ${location.pathname === "/auth" ? "active" : ""}`} onClick={() => navigate("/auth")}>
              <UserLock className="user-icon" /> 
            </button>
            <span className="signin-label">Sign In</span>
          </div>
        )}
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

export default Sidebar;