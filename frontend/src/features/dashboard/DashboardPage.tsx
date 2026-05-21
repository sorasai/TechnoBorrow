import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Info, Bell } from "lucide-react";
import { authApi } from "../auth/api";
import { borrowingApi } from "./api";
import Sidebar from "../../shared/ui/Sidebar";
import Header from "../../shared/ui/Header";
import CreateRequestModal from "./CreateRequestModal";
import DashboardWelcome from "./DashboardWelcome";
import StatsCards from "./StatsCards";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";
import RequestCard from "./RequestCard";
import RequestDetailsModal from "./RequestDetailsModal";
import { SkeletonGrid } from "./SkeletonCard";
import "./dashboard.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined);
  const [requests, setRequests] = useState<any[]>([]);
  const requestsRef = React.useRef<any[]>([]);
  const [toasts, setToasts] = useState<any[]>([]);
  const [hasOngoingTransactions, setHasOngoingTransactions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserOffers = useCallback(async (userId: number) => {
    try {
      const offers = await borrowingApi.getOffersForUser(userId);
      const acceptedOffers = offers.filter((o: any) => o.status === 'ACCEPTED');
      
      if (acceptedOffers.length === 0) {
        setHasOngoingTransactions(false);
        return;
      }
      
      const allRequests = await borrowingApi.getAllRequests();
      const acceptedOfferRequestIds = acceptedOffers.map((o: any) => o.requestId);
      
      const ongoingLending = allRequests.filter((req: any) => 
        acceptedOfferRequestIds.includes(req.id) && req.status === 'MATCHED'
      );
      
      setHasOngoingTransactions(ongoingLending.length > 0);
    } catch (error) {
      console.error("Failed to fetch user offers", error);
    }
  }, []);

  // Update ref whenever requests state changes
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 6000);
  };

  const fetchRequests = useCallback(async (isInitial = false) => {
    try {
      const rawData = await borrowingApi.getAllRequests();
      const data = rawData.filter((req: any) => req.status === 'POSTED');
      const currentUser = authApi.getCurrentUser();
      
      if (currentUser) {
        // Detect new offers for borrower using ref to avoid stale closure
        if (!isInitial && requestsRef.current.length > 0) {
          data.forEach((newReq: any) => {
            const oldReq = requestsRef.current.find(r => r.id === newReq.id);
            if (oldReq && newReq.requesterId === currentUser.id && newReq.offerCount > oldReq.offerCount) {
              showToast(`You have received a new offer for "${newReq.itemName}"!`, 'info');
            }
          });
        }

        const sortedData = [...data].sort((a, b) => {
          const isAOwner = a.requesterId === currentUser.id;
          const isBOwner = b.requesterId === currentUser.id;
          if (isAOwner && !isBOwner) return -1;
          if (!isAOwner && isBOwner) return 1;
          return 0;
        });
        setRequests(sortedData);
      } else {
        setRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      
      try {
        await Promise.all([
          fetchRequests(true),
          checkUserOffers(currentUser.id)
        ]);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Auto-refresh every 10 seconds (faster for testing) to catch new offers
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);
    return () => clearInterval(interval);
  }, [navigate, fetchRequests, checkUserOffers]);

  const handleRequestCreated = () => {
    showToast("Request created successfully!");
    fetchRequests();
    setIsModalOpen(false);
  };

  const handleViewDetails = (request: any) => {
    setInitialTab(undefined);
    setSelectedRequest(request);
  };

  const handleViewOffers = (request: any) => {
    setInitialTab("offers");
    setSelectedRequest(request);
  };

  const avatarUrl = user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : undefined;
  const fullName = user?.fullName || "User";
  const firstName = fullName.split(" ")[0];

  const formatCreatedAt = (isoString: string) => {
    const isUTC = isoString.endsWith('Z') || isoString.includes('+') || (isoString.includes('-') && isoString.lastIndexOf('-') > 10);
    const dateString = isUTC ? isoString : `${isoString}Z`;
    const date = new Date(dateString);
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
          <StatsCards hasOngoingTransactions={hasOngoingTransactions} />

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
            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : requests.length > 0 ? (
              <div className="requests-grid">
                {requests.map((req) => (
                  <RequestCard 
                    key={req.id}
                    itemName={req.itemName}
                    description={req.description}
                    requesterName={req.requesterName}
                    requesterImage={req.requesterImage}
                    createdAt={formatCreatedAt(req.createdAt)}
                    status={req.status}
                    offerCount={req.offerCount}
                    isOwner={user && req.requesterId === user.id}
                    onViewDetails={() => handleViewDetails(req)}
                    onViewOffers={() => handleViewOffers(req)}
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

      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onOfferSuccess={(msg) => showToast(msg, 'success')}
          initialTab={initialTab}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type} ${toast.fading ? 'toast-fade-out' : ''}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} color="#22C55E" />}
              {toast.type === 'info' && <Bell size={20} color="#3B82F6" />}
              {toast.type === 'warning' && <Info size={20} color="#FBBF24" />}
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
