import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Info, Bell, X } from "lucide-react";
import { authApi } from "../auth/api";
import { borrowingApi } from "./api";
import Sidebar from "../../shared/ui/Sidebar";
import Header from "../../shared/ui/Header";
import RequestCard from "./RequestCard";
import RequestDetailsModal from "./RequestDetailsModal";

import { SkeletonGrid, SkeletonTableRow } from "./SkeletonCard";
import "./dashboard.css";

function MyRequestsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [pastRequests, setPastRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<any[]>([]);
  const [, setShownMatchedAlerts] = useState<number[]>([]);
  const [confirmingReceiptRequest, setConfirmingReceiptRequest] = useState<any | null>(null);
  const [confirmingReturnRequest, setConfirmingReturnRequest] = useState<any | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, type === 'info' ? 15000 : 6000);
  };

  const fetchMyRequests = useCallback(async () => {
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) return;
      
      const allRequests = await borrowingApi.getAllRequests();
      const myRequests = allRequests.filter((req: any) => req.requesterId === currentUser.id);
      
      const active = myRequests.filter((req: any) => req.status === 'POSTED' || req.status === 'MATCHED' || req.status === 'BORROWED' || req.status === 'BORROWER_RETURNED' || req.status === 'LENDER_RETURNED');
      const past = myRequests.filter((req: any) => req.status === 'RETURNED' || req.status === 'CANCELLED');

      // Trigger matched alerts
      active.forEach((req: any) => {
        setShownMatchedAlerts(prev => {
          if (req.status === 'MATCHED' && !prev.includes(req.id)) {
            showToast(`Status matched for "${req.itemName}"! Please confirm later once you have received the item you requested to borrow.`, 'info');
            return [...prev, req.id];
          }
          return prev;
        });
      });
      
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
    const loadData = async () => {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      try {
        await fetchMyRequests();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    const interval = setInterval(fetchMyRequests, 10000);
    return () => clearInterval(interval);
  }, [navigate, fetchMyRequests]);

  const handleConfirmBorrow = async () => {
    if (!confirmingReceiptRequest) return;
    try {
      setConfirming(true);
      await borrowingApi.confirmBorrow(confirmingReceiptRequest.id);
      showToast(`Confirmed receipt for "${confirmingReceiptRequest.itemName}".`, 'success');
      setConfirmingReceiptRequest(null);
      fetchMyRequests();
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Failed to confirm borrow receipt.');
      showToast(errorMsg, 'warning');
    } finally {
      setConfirming(false);
    }
  };

  const handleConfirmReturn = async () => {
    if (!confirmingReturnRequest) return;
    try {
      setConfirming(true);
      await borrowingApi.confirmReturn(confirmingReturnRequest.id, user.id);
      showToast(`Marked "${confirmingReturnRequest.itemName}" as returned.`, 'success');
      setConfirmingReturnRequest(null);
      fetchMyRequests();
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Failed to mark as returned.');
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
            <h2 className="requests-section-title" style={{ color: '#7A1E2D' }}>My Active Requests</h2>
            <p className="requests-section-subtitle">Requests that are currently ongoing.</p>
            
            {isLoading ? (
              <SkeletonGrid count={3} />
            ) : activeRequests.length > 0 ? (
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
                    onConfirmBorrow={() => setConfirmingReceiptRequest(req)}
                    confirmReturnLabel={(req.status === 'BORROWED' || req.status === 'LENDER_RETURNED') ? "Mark as Returned" : undefined}
                    confirmReturnMessage={req.status === 'BORROWER_RETURNED' ? "Waiting for other user to confirm" : undefined}
                    onConfirmReturn={() => setConfirmingReturnRequest(req)}
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
            
            {isLoading ? (
              <div className="history-table-container" style={{ overflowX: 'auto', marginTop: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Name</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Posted</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Completed</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonTableRow cols={5} />
                    <SkeletonTableRow cols={5} />
                    <SkeletonTableRow cols={5} />
                  </tbody>
                </table>
              </div>
            ) : pastRequests.length > 0 ? (
              <div className="history-table-container" style={{ overflowX: 'auto', marginTop: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Name</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Posted</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Completed</th>
                      <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }} className="table-row-hover">
                        <td style={{ padding: '16px', fontSize: '15px', color: '#1F2937', fontWeight: 600 }}>{req.itemName}</td>
                        <td style={{ padding: '16px' }}>
                          <span className={`request-card-status ${getStatusClass(req.status)}`} style={{ padding: '6px 12px', fontSize: '11px', letterSpacing: '0.5px' }}>
                            {(req.status === 'BORROWER_RETURNED' || req.status === 'LENDER_RETURNED') ? 'BORROWED' : req.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#4B5563' }}>
                          {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#4B5563' }}>
                          {req.status === 'RETURNED' ? new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
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
                    ))}
                  </tbody>
                </table>
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

      {/* Confirm Item Receipt Popup */}
      {confirmingReceiptRequest && (
        <div className="modal-overlay" style={{ zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px', position: 'relative', textAlign: 'center' }}>
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              onClick={() => setConfirmingReceiptRequest(null)}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '18px', color: '#7A1E2D', fontWeight: 700, marginTop: '8px', marginBottom: '16px' }}>
              Confirm Item Received
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '24px' }}>
              You confirm you have received the item from your lender.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmingReceiptRequest(null)}
                style={{ padding: '10px 20px', border: '1px solid #7A1E2D', color: '#7A1E2D', backgroundColor: 'transparent', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBorrow}
                disabled={confirming}
                style={{ padding: '10px 20px', border: 'none', color: '#FFFFFF', backgroundColor: '#7A1E2D', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                {confirming ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
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
              You confirm that you have returned the item to your lender.
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

export default MyRequestsPage;
