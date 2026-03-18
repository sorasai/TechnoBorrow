import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ClipboardList, RefreshCw, Package, Search, Plus } from "lucide-react";
import Sidebar from "../components/ui/Sidebar";
import { supabase } from "../lib/supabase";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
    };
    loadUser();
  }, [navigate]);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || "User";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-area">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-header-title">
            TechnoBorrow
          </h1>
          <div 
            className="dashboard-profile-avatar" 
            onClick={() => navigate("/profile")} 
            title="Go to Profile"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" />
            ) : (
              <User size={20} color="#6B7280" />
            )}
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="dashboard-content">
          
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h2 className="dashboard-welcome-title">
              Hello, {firstName}!
            </h2>
            <p className="dashboard-welcome-subtitle">
              Manage your borrowing requests, monitor active transactions, and explore equipment posted by fellow Teknoys.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            {/* Card 1 */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-wrapper yellow">
                <ClipboardList size={24} color="#FFFFFF" />
              </div>
              <div>
                <h3 className="dashboard-stat-title">My Active Requests</h3>
                <p className="dashboard-stat-desc">
                  Borrowing requests you have posted that are awaiting or in progress.
                </p>
              </div>
            </div>

            {/* Card 2 (Active/Bordered) */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-wrapper orange">
                <RefreshCw size={24} color="#FFFFFF" />
              </div>
              <div>
                <h3 className="dashboard-stat-title">Ongoing Transactions</h3>
                <p className="dashboard-stat-desc">
                  Active borrowing or lending transactions that require monitoring or action.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-wrapper green">
                <Package size={24} color="#FFFFFF" />
              </div>
              <div>
                <h3 className="dashboard-stat-title">Returned Transactions</h3>
                <p className="dashboard-stat-desc">
                  Transactions that have been successfully completed and confirmed as returned.
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="dashboard-action-area">
            {/* Search Input */}
            <div className="dashboard-search-wrapper">
              <Search size={18} color="#9CA3AF" className="dashboard-search-icon" />
              <input 
                type="text" 
                placeholder="Search for items..." 
                className="dashboard-search-input"
              />
            </div>
            {/* Create Button */}
            <button className="dashboard-create-btn">
              <Plus size={16} /> Create Request
            </button>
          </div>

          {/* Empty State / Content Area */}
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-title">
              No borrowing requests available at the moment.
            </p>
            <p className="dashboard-empty-subtext">
              Be the first to post a request.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
