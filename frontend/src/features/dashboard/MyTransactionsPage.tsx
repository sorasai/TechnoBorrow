import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Info, Bell, ArrowLeft } from "lucide-react";
import { authApi } from "../auth/api";
import { borrowingApi } from "./api";
import Sidebar from "../../shared/ui/Sidebar";
import Header from "../../shared/ui/Header";
import RequestCard from "./RequestCard";
import RequestDetailsModal from "./RequestDetailsModal";
import "./dashboard.css";

function MyTransactionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [ongoingTransactions, setOngoingTransactions] = useState<any[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
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

  const fetchTransactions = useCallback(async () => {
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) return;
      
      const allRequests = await borrowingApi.getAllRequests();
      const userOffers = await borrowingApi.getOffersForUser(currentUser.id);
      
      const acceptedOfferRequestIds = userOffers
        .filter((o: any) => o.status === 'ACCEPTED')
        .map((o: any) => o.requestId);
      
      const ongoing = allRequests.filter((req: any) => {
        return acceptedOfferRequestIds.includes(req.id) && req.status === 'MATCHED';
      });
      
      const history = allRequests.filter((req: any) => {
        return acceptedOfferRequestIds.includes(req.id) && req.status === 'COMPLETED';
      });
      
      // Sort newest first
      ongoing.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      history.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOngoingTransactions(ongoing);
      setTransactionHistory(history);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  }, []);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    fetchTransactions();
    
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, [navigate, fetchTransactions]);

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
            <h2 className="requests-section-title" style={{ color: '#F97316' }}>Ongoing Transactions</h2>
            <p className="requests-section-subtitle">Active transactions where you are lending items.</p>
            
            {ongoingTransactions.length > 0 ? (
              <div className="requests-grid">
                {ongoingTransactions.map((req) => (
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
                    onViewDetails={() => { setInitialTab(undefined); setSelectedRequest(req); }}
                    onViewOffers={() => { setInitialTab("offers"); setSelectedRequest(req); }}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state" style={{ padding: '40px 0' }}>
                <p className="dashboard-empty-title">No ongoing transactions</p>
                <p className="dashboard-empty-subtext">You are not currently involved in any active borrowing or lending.</p>
              </div>
            )}
          </div>

          <hr className="section-divider" style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '32px 0' }} />

          <div className="requests-section">
            <h2 className="requests-section-title">Transaction History</h2>
            <p className="requests-section-subtitle">A record of your all transactions.</p>
            
            {transactionHistory.length > 0 ? (
              <div className="requests-grid">
                {transactionHistory.map((req) => (
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
                    onViewDetails={() => { setInitialTab(undefined); setSelectedRequest(req); }}
                    onViewOffers={() => { setInitialTab("offers"); setSelectedRequest(req); }}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state" style={{ padding: '40px 0' }}>
                <p className="dashboard-empty-title">No transaction history</p>
                <p className="dashboard-empty-subtext">Your completed transactions will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onOfferSuccess={(msg) => { showToast(msg, 'success'); fetchTransactions(); }}
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

export default MyTransactionsPage;
