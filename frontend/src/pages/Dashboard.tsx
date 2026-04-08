import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/ui/Sidebar";
import CreateRequestModal from "../components/dashboard/CreateRequestModal";
import Header from "../components/ui/Header";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import StatsCards from "../components/dashboard/StatsCards";
import SearchBar from "../components/dashboard/SearchBar";
import EmptyState from "../components/dashboard/EmptyState";
import RequestCard from "../components/dashboard/RequestCard";
import { authApi } from "../api/auth";
import { borrowingApi } from "../api/borrowing";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await borrowingApi.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    };
    loadUser();
    fetchRequests();
  }, [navigate, fetchRequests]);

  const handleRequestCreated = () => {
    fetchRequests();
    setIsModalOpen(false);
  };

  const avatarUrl = user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : undefined;
  const fullName = user?.fullName || "User";
  const firstName = fullName.split(" ")[0];

  const formatCreatedAt = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-area">
        {/* Header */}
        <Header  
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

          {/* Requests Feed */}
          <div className="requests-section">
            <h2 className="requests-section-title">Explore Borrowing Requests</h2>
            <p className="requests-section-subtitle">Active campus requests available for lending</p>
            {requests.length > 0 ? (
              <div className="requests-grid">
                {requests.map((req) => (
                  <RequestCard 
                    key={req.id}
                    itemName={req.itemName}
                    description={req.description}
                    requesterName={req.requesterName}
                    createdAt={formatCreatedAt(req.createdAt)}
                    status={req.status}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

        </main>
      </div>

      {isModalOpen && (
        <CreateRequestModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleRequestCreated} 
        />
      )}
    </div>
  );
}

export default Dashboard;
