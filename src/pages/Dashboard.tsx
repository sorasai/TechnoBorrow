import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/ui/Sidebar";
import CreateRequestModal from "../components/dashboard/CreateRequestModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import StatsCards from "../components/dashboard/StatsCards";
import SearchBar from "../components/dashboard/SearchBar";
import EmptyState from "../components/dashboard/EmptyState";
import { supabase } from "../lib/supabase";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <DashboardHeader 
          avatarUrl={avatarUrl} 
          onProfileClick={() => navigate("/profile")} 
        />

        {/* Dashboard Main Content */}
        <main className="dashboard-content">
          
          {/* Welcome Section */}
          <DashboardWelcome firstName={firstName} />

          {/* Stats Cards */}
          <StatsCards />

          {/* Action Area */}
          <div className="dashboard-action-area">
            {/* Search Input */}
            <SearchBar />
            {/* Create Button */}
            <button className="dashboard-create-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Create Request
            </button>
          </div>

          {/* Empty State / Content Area */}
          <EmptyState />

        </main>
      </div>

      {isModalOpen && (
        <CreateRequestModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;
