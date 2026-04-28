import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Info, Bell, ArrowLeft } from "lucide-react";
import { authApi } from "../auth/api";
import { borrowingApi } from "./api";
import Sidebar from "../../shared/ui/Sidebar";
import Header from "../../shared/ui/Header";
import RequestCard from "./RequestCard";
import RequestDetailsModal from "./RequestDetailsModal";
import EmptyState from "./EmptyState";
import "./dashboard.css";

function MyRequestsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [pastRequests, setPastRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<any[]>([]);

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

  const fetchMyRequests = useCallback(async () => {
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) return;
      
      const allRequests = await borrowingApi.getAllRequests();
      const myRequests = allRequests.filter((req: any) => req.requesterId === currentUser.id);
      
      const active = myRequests.filter((req: any) => req.status === 'POSTED' || req.status === 'MATCHED');
      const past = myRequests.filter((req: any) => req.status !== 'POSTED' && req.status !== 'MATCHED');
      
      // Sort newest first
      active.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      past.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setActiveRequests(active);
      setPastRequests(past);
    } catch (error) {
      console.error("Failed to fetch my requests", error);
    }
  }, []);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    fetchMyRequests();
    
    const interval = setInterval(fetchMyRequests, 10000);
    return () => clearInterval(interval);
  }, [navigate, fetchMyRequests]);

  const avatarUrl = user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : undefined;

  const formatCreatedAt = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-area">
        <Header avatarUrl={avatarUrl} onProfileClick={() => navigate("/profile")} />

        <main className="dashboard-content">


          <div className="requests-section">
            <h2 className="requests-section-title" style={{ color: '#7A1E2D' }}>My Active Requests</h2>
            <p className="requests-section-subtitle">Requests that are currently ongoing.</p>
            
            {activeRequests.length > 0 ? (
              <div className="requests-grid">
                {activeRequests.map((req) => (
                  <RequestCard 
                    key={req.id}
                    itemName={req.itemName}
                    description={req.description}
                    requesterName={req.requesterName}
                    requesterImage={req.requesterImage}
                    createdAt={formatCreatedAt(req.createdAt)}
                    status={req.status}
                    offerCount={req.offerCount}
                    isOwner={true}
                    onViewDetails={() => { setInitialTab(undefined); setSelectedRequest(req); }}
                    onViewOffers={() => { setInitialTab("offers"); setSelectedRequest(req); }}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state" style={{ padding: '40px 0' }}>
                <p className="dashboard-empty-title">No active requests</p>
                <p className="dashboard-empty-subtext">You don't have any pending or ongoing requests at the moment.</p>
              </div>
            )}
          </div>

          <hr className="section-divider" style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '32px 0' }} />

          <div className="requests-section">
            <h2 className="requests-section-title">Request History</h2>
            <p className="requests-section-subtitle">Your completed or cancelled borrowing requests.</p>
            
            {pastRequests.length > 0 ? (
              <div className="requests-grid">
                {pastRequests.map((req) => (
                  <RequestCard 
                    key={req.id}
                    itemName={req.itemName}
                    description={req.description}
                    requesterName={req.requesterName}
                    requesterImage={req.requesterImage}
                    createdAt={formatCreatedAt(req.createdAt)}
                    status={req.status}
                    offerCount={req.offerCount}
                    isOwner={true}
                    onViewDetails={() => { setInitialTab(undefined); setSelectedRequest(req); }}
                    onViewOffers={() => { setInitialTab("offers"); setSelectedRequest(req); }}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state" style={{ padding: '40px 0' }}>
                <p className="dashboard-empty-title">No request history</p>
                <p className="dashboard-empty-subtext">Your past requests will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onOfferSuccess={(msg) => { showToast(msg, 'success'); fetchMyRequests(); }}
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

export default MyRequestsPage;
