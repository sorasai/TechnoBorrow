import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Info, Bell, X } from "lucide-react";
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
  const [confirmingReturnRequest, setConfirmingReturnRequest] = useState<any | null>(null);
  const [confirming, setConfirming] = useState(false);
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
      const lenderRequestIds = userOffers
        .filter((o: any) => o.status === 'ACCEPTED')
        .map((o: any) => o.requestId);
      
      const ongoing = allRequests.filter((req: any) => {
        const isBorrower = req.requesterId === currentUser.id;
        const isLender = lenderRequestIds.includes(req.id);
        const isOngoingStatus = ['MATCHED', 'BORROWED', 'BORROWER_RETURNED', 'LENDER_RETURNED'].includes(req.status);
        return (isBorrower || isLender) && isOngoingStatus;
      });
      
      const history = allRequests.filter((req: any) => {
        const isBorrower = req.requesterId === currentUser.id;
        const isLender = lenderRequestIds.includes(req.id);
        const isPastStatus = ['RETURNED', 'CANCELLED'].includes(req.status);
        return (isBorrower || isLender) && isPastStatus;
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

  const handleConfirmReturn = async () => {
    if (!confirmingReturnRequest) return;
    try {
      setConfirming(true);
      await borrowingApi.confirmReturn(confirmingReturnRequest.id, user.id);
      showToast(`Confirmed item return for "${confirmingReturnRequest.itemName}".`, 'success');
      setConfirmingReturnRequest(null);
      fetchTransactions();
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Failed to confirm return.');
      showToast(errorMsg, 'warning');
    } finally {
      setConfirming(false);
    }
  };

  const getStatusClass = (statusText: string) => {
    switch (statusText.toLowerCase()) {
      case "posted":
        return "status-badge-posted";
      case "matched":
        return "status-badge-matched";
      case "borrowed":
      case "borrower_returned":
      case "lender_returned":
        return "status-badge-borrowed";
      case "pending":
        return "status-badge-pending";
      case "complete":
      case "returned":
        return "status-badge-complete";
      default:
        return "status-badge-default";
    }
  };

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
                    confirmReturnLabel={(req.status === 'BORROWED' || req.status === 'BORROWER_RETURNED') ? "Confirm Return" : undefined}
                    confirmReturnMessage={req.status === 'LENDER_RETURNED' ? "Waiting for other user to confirm" : undefined}
                    onConfirmReturn={() => setConfirmingReturnRequest(req)}
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
              <div className="history-table-container" style={{ overflowX: 'auto', marginTop: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((req) => {
                      const isRequester = user && req.requesterId === user.id;
                      const role = isRequester ? "Borrower" : "Lender";
                      return (
                        <tr key={req.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontSize: '15px', color: '#1F2937', fontWeight: 600 }}>{req.itemName}</td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4B5563' }}>{role}</td>
                          <td style={{ padding: '16px' }}>
                            <span className={`request-card-status ${getStatusClass(req.status)}`} style={{ padding: '6px 12px', fontSize: '11px', letterSpacing: '0.5px' }}>
                              {(req.status === 'BORROWER_RETURNED' || req.status === 'LENDER_RETURNED') ? 'BORROWED' : req.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button 
                              onClick={() => { setInitialTab(undefined); setSelectedRequest(req); }}
                              style={{ padding: '6px 16px', backgroundColor: 'transparent', border: '1.5px solid #7A1E2D', color: '#7A1E2D', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                              className="table-action-btn"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

      {confirmingReturnRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
              onClick={() => setConfirmingReturnRequest(null)}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '18px', color: '#7A1E2D', fontWeight: 700, marginTop: '8px', marginBottom: '16px' }}>
              Confirm Item Returned
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '24px' }}>
              You confirm that you have received the item from your borrower.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmingReturnRequest(null)}
                style={{ padding: '10px 20px', border: '1px solid #7A1E2D', color: '#7A1E2D', backgroundColor: 'transparent', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReturn}
                disabled={confirming}
                style={{ padding: '10px 20px', border: 'none', color: '#FFFFFF', backgroundColor: '#7A1E2D', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                {confirming ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
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
