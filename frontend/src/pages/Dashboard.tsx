import React, { useEffect, useState } from "react";
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
import "../css/dashboard.css";

const MOCK_REQUESTS = [
  {
    id: 1,
    itemName: "MacBook Pro M2 - Need for final project",
    description: "Looking to borrow a MacBook Pro for a week to compile my iOS application. Mine is currently broken and in repair.",
    requesterName: "Sarah Jenkins",
    createdAt: "2 hours ago",
    status: "Posted"
  },
  {
    id: 2,
    itemName: "Arduino Starter Kit",
    description: "I need an Arduino kit for my robotics class this semester. Will return it in pristine condition by December.",
    requesterName: "Mark Denson",
    createdAt: "5 hours ago",
    status: "Pending"
  },
  {
    id: 3,
    itemName: "Scientific Calculator (Casio fx-991EX)",
    description: "Forgot mine and have a calculus midterm tomorrow. Can meet anywhere on campus!",
    requesterName: "Emily Chen",
    createdAt: "1 day ago",
    status: "Posted"
  }
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const user = authApi.getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
    };
    loadUser();
  }, [navigate]);

  const avatarUrl = user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : undefined;
  const fullName = user?.fullName || "User";
  const firstName = fullName.split(" ")[0];

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
            {MOCK_REQUESTS.length > 0 ? (
              <div className="requests-grid">
                {MOCK_REQUESTS.map((req) => (
                  <RequestCard 
                    key={req.id}
                    itemName={req.itemName}
                    description={req.description}
                    requesterName={req.requesterName}
                    createdAt={req.createdAt}
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
        <CreateRequestModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;
