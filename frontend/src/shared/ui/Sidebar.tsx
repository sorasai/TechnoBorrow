import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  User, 
  LogOut, 
  X 
} from "lucide-react";
import { authApi } from "../../features/auth/api";
import "./sidebar.css";
import TechnoBorrowLogo from "../assets/TechnoBorrow_logo.png";
import LogoutModal from "./LogoutModal";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const currentPath = location.pathname;

  return (
    <div 
      className={`sidebar-transition sidebar-container ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
      onClick={() => {
        if (isCollapsed) setIsCollapsed(false);
      }}
    >
      <div className={`sidebar-header ${isCollapsed ? "collapsed" : "expanded"}`}>
        {!isCollapsed && (
          <div className="sidebar-menu-title">
            Menu
          </div>
        )}
        
        <div
          className="sidebar-toggle-wrapper"
          onClick={(e) => {
            if (!isCollapsed) {
              e.stopPropagation();
              setIsCollapsed(true);
            }
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <img src={TechnoBorrowLogo} alt="Logo" className="sidebar-logo-collapsed" />
          ) : (
            <button className="sidebar-close-btn">
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="sidebar-menu-list">
        <div 
          className={`sidebar-item-hover ${currentPath === "/dashboard" ? "sidebar-item-active" : "sidebar-item-normal"} ${isCollapsed ? "sidebar-item-collapsed" : "sidebar-item-expanded"}`}
          onClick={() => navigate("/dashboard")}
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
          {!isCollapsed && <span className="sidebar-item-text">Dashboard</span>}
        </div>
        
        <div 
          className={`sidebar-item-hover ${currentPath === "/my-requests" ? "sidebar-item-active" : "sidebar-item-normal"} ${isCollapsed ? "sidebar-item-collapsed" : "sidebar-item-expanded"}`}
          onClick={() => navigate("/my-requests")}
          title="My Requests"
        >
          <FileText size={20} />
          {!isCollapsed && <span className="sidebar-item-text">My Requests</span>}
        </div>

        <div 
          className={`sidebar-item-hover ${currentPath === "/my-transactions" ? "sidebar-item-active" : "sidebar-item-normal"} ${isCollapsed ? "sidebar-item-collapsed" : "sidebar-item-expanded"}`}
          onClick={() => navigate("/my-transactions")}
          title="My Transactions"
        >
          <CreditCard size={20} />
          {!isCollapsed && <span className="sidebar-item-text">My Transactions</span>}
        </div>

        <div 
          className={`sidebar-item-hover ${currentPath === "/profile" ? "sidebar-item-active" : "sidebar-item-normal"} ${isCollapsed ? "sidebar-item-collapsed" : "sidebar-item-expanded"}`}
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          <User size={20} />
          {!isCollapsed && <span className="sidebar-item-text">Profile</span>}
        </div>

        <div className="sidebar-divider"></div>

        <div 
          className={`sidebar-item-hover sidebar-item-logout ${isCollapsed ? "sidebar-item-collapsed" : "sidebar-item-expanded"}`}
          onClick={() => setIsLogoutModalOpen(true)}
          title="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="sidebar-item-text">Logout</span>}
        </div>
      </div>

      <div className="sidebar-footer" style={{ display: isCollapsed ? "none" : "block" }}>
        © 2026 TechnoBorrow – CIT-U Academic Project
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default Sidebar;
