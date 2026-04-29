import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Target } from 'lucide-react';
import { authApi } from '../auth/api';
import { borrowingApi } from './api';

interface RequestDetailsModalProps {
  request: any;
  onClose: () => void;
  onOfferSuccess?: (message: string) => void;
  initialTab?: string;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, onOfferSuccess, initialTab }) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [offering, setOffering] = useState(false);
  const [confirmingOffer, setConfirmingOffer] = useState<any | null>(null);
  const currentUser = authApi.getCurrentUser();

  useEffect(() => {
    if (request && request.id) {
      borrowingApi.getOffersForRequest(request.id)
        .then((data) => {
          // Sort newest first (descending by createdAt)
          const sortedOffers = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOffers(sortedOffers);
        })
        .catch(console.error);
    }
  }, [request]);

  if (!request) return null;

  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const postedDate = new Date(request.createdAt);

  const formatOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', day: 'numeric', year: 'numeric', 
    hour: 'numeric', minute: '2-digit' 
  };

  const startStr = startDate.toLocaleString('en-US', formatOptions);
  const endStr = endDate.toLocaleString('en-US', formatOptions);
  const postedStr = postedDate.toLocaleString('en-US', formatOptions);

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = diffMs > 0 ? (diffMs / (1000 * 60 * 60)).toFixed(1) : 0;

  const userImageSrc = request.requesterImage 
    ? `data:image/jpeg;base64,${request.requesterImage}` 
    : `https://ui-avatars.com/api/?name=${request.requesterName?.replace(' ', '+')}&background=random`;

  const itemImageSrc = request.itemImage 
    ? `data:image/jpeg;base64,${request.itemImage}` 
    : null;

  const handleOffer = async () => {
    if (!currentUser) return;
    try {
      setOffering(true);
      await borrowingApi.createOffer(request.id, currentUser.id, "I can lend this item.");
      if (onOfferSuccess) onOfferSuccess("Offer submitted successfully!");
      onClose(); // Close modal on success
    } catch (err: any) {
      alert(err.response?.data || 'Failed to submit offer.');
    } finally {
      setOffering(false);
    }
  };

  const handleAccept = async (offerId: number) => {
    try {
      await borrowingApi.acceptOffer(offerId);
      if (onOfferSuccess) onOfferSuccess("Offer accepted successfully!");
      setConfirmingOffer(null);
      onClose(); // Close modal on success
    } catch (err: any) {
      alert(err.response?.data || 'Failed to accept offer.');
    }
  };

  const isOwnRequest = currentUser && request.requesterId === currentUser.id;
  const isPosted = request.status === 'POSTED';
  const hasOffered = currentUser && offers.some(o => o.lenderId === currentUser.id);

  const showOfferButton = !isOwnRequest && isPosted;

  return (
    <div className="modal-overlay" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
      <style>{`
        .premium-rd-modal {
          background: #FFFFFF !important;
          border-radius: 24px !important;
          border: 1px solid rgba(229, 231, 235, 0.5) !important;
          overflow: hidden !important;
        }
        .premium-rd-header {
          background: #7A1E2D !important;
          padding: 24px 32px !important;
          border-bottom: none !important;
        }
        .premium-rd-header h2 {
          color: #FFFFFF !important;
          font-family: 'Outfit', sans-serif !important;
          font-weight: 700 !important;
          font-size: 22px !important;
          letter-spacing: -0.5px !important;
          margin: 0 !important;
        }
        .premium-rd-close {
          color: rgba(255, 255, 255, 0.8) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 50% !important;
          padding: 6px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .premium-rd-close:hover {
          color: #FFFFFF !important;
          background: rgba(255, 255, 255, 0.2) !important;
        }
        .premium-rd-body {
          padding: 32px !important;
          gap: 32px !important;
        }
        .premium-rd-item-name {
          font-family: 'Outfit', sans-serif !important;
          font-weight: 800 !important;
          font-size: 28px !important;
          color: #1E293B !important;
          margin-bottom: 12px !important;
          letter-spacing: -0.5px !important;
        }
        .premium-rd-desc {
          font-size: 15px !important;
          color: #64748B !important;
          line-height: 1.6 !important;
        }
        .premium-rd-detail-card {
          background: #F8FAFC !important;
          border-radius: 16px !important;
          padding: 20px !important;
          border: 1px solid #F1F5F9 !important;
        }
        .premium-rd-detail-card:hover {
          background: #FFFFFF !important;
          border-color: #E2E8F0 !important;
        }
        .premium-rd-badge {
          padding: 6px 14px !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          border-radius: 9999px !important;
          letter-spacing: 0.5px !important;
        }
        .premium-rd-user-row {
          background: #F8FAFC !important;
          border-radius: 16px !important;
          padding: 16px !important;
          border: 1px solid #F1F5F9 !important;
          margin-bottom: 24px !important;
        }
        .premium-lend-btn {
          background: #7A1E2D !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 14px 28px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          color: #FFFFFF !important;
          width: 100% !important;
          cursor: pointer !important;
        }
        .premium-lend-btn:hover:not(:disabled) {
          background: #5A0F1B !important;
        }
      `}</style>
      <div className="modal-content request-details-modal premium-rd-modal">
        <div className="modal-header premium-rd-header">
          <h2 className="modal-title">Request Details</h2>
          <button className="modal-close-btn premium-rd-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body rd-modal-body-flex">
          <div className="rd-left-col">
            {itemImageSrc ? (
              <div className="rd-image-container">
                <img src={itemImageSrc} alt={request.itemName} className="rd-item-image" />
              </div>
            ) : (
              <div className="rd-no-image-container">
                <div className="rd-no-image-text">No image attached</div>
              </div>
            )}

            <div className="rd-title-section" style={{ margin: '24px 0' }}>
              <h3 className="rd-item-name premium-rd-item-name">{request.itemName}</h3>
              <p className="rd-description premium-rd-desc">{request.description}</p>
            </div>

            {/* Stepper UI */}
            {request.status !== 'POSTED' && (
              <div className="stepper-container">
                <div className="stepper-wrapper">
                  {(() => {
                    const steps = ['POSTED', 'MATCHED', 'BORROWED', 'RETURNED'];
                    let currentStep = 0;
                    if (request.status === 'POSTED') currentStep = 0;
                    else if (request.status === 'MATCHED') currentStep = 1;
                    else if (request.status === 'BORROWED' || request.status === 'BORROWER_RETURNED' || request.status === 'LENDER_RETURNED') currentStep = 2;
                    else if (request.status === 'RETURNED' || request.status === 'COMPLETED') currentStep = 3;

                    const progressWidth = currentStep === 0 ? '0%' : 
                                        currentStep === 1 ? '33%' : 
                                        currentStep === 2 ? '66%' : '100%';

                    return (
                      <>
                        <div className="stepper-progress-bar" style={{ width: `calc(${progressWidth} - 40px)` }}></div>
                        {steps.map((step, index) => {
                          const isActive = index === currentStep;
                          const isCompleted = index < currentStep;
                          return (
                            <div key={step} className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                              <div className="stepper-circle">
                                {isCompleted ? '✓' : index + 1}
                              </div>
                              <span className="stepper-label">{step}</span>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Offers Received Section for Requester */}
            {isOwnRequest && isPosted && (
              <div className={`rd-offers-section ${initialTab === 'offers' ? 'highlight-section' : ''}`}>
                <h4 className="rd-section-subtitle">Offers Received</h4>
                <div className="rd-offers-list">
                  {offers.length > 0 ? (
                    <ul className="rd-offers-ul">
                      {offers.map((offer) => (
                        <li key={offer.id} className="rd-offer-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span className="rd-lender-name">{offer.lenderName}</span>
                            <span className="rd-offer-time" style={{ fontSize: '12px', color: '#6B7280' }}>
                              {new Date(offer.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {isOwnRequest && isPosted && offer.status === 'PENDING' && (
                            <button 
                              onClick={() => setConfirmingOffer(offer)}
                              className="rd-accept-btn"
                            >
                              Accept Offer
                            </button>
                          )}
                          {offer.status === 'ACCEPTED' && (
                            <span style={{ fontSize: '13px', color: '#7A1E2D', fontWeight: 'bold' }}>✓ Accepted Offer</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rd-no-offers-text">No offers yet</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rd-right-col">
            <div className="rd-header-section">
              <div className="rd-user-row premium-rd-user-row" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={userImageSrc} alt={request.requesterName} className="rd-user-avatar" style={{ border: '2px solid #7A1E2D', padding: '2px' }} />
                  <div className="rd-user-text">
                    <div className="rd-user-name" style={{ fontWeight: 700, fontSize: '16px' }}>{request.requesterName}</div>
                    <div className="rd-post-date">{postedStr}</div>
                  </div>
                </div>
                <div className={`rd-status-badge rd-status-${request.status?.toLowerCase()} premium-rd-badge`}>
                  {request.status}
                </div>
              </div>
            </div>

            <div className="rd-details-grid-vertical" style={{ gap: '16px' }}>
              <div className="rd-detail-box premium-rd-detail-card">
                <div className="rd-box-label" style={{ color: '#7A1E2D', fontWeight: 700 }}><Target size={16}/> Purpose</div>
                <div className="rd-box-value" style={{ fontSize: '15px', color: '#1E293B', lineHeight: 1.5 }}>{request.purpose}</div>
              </div>
              
              <div className="rd-detail-box premium-rd-detail-card">
                <div className="rd-box-label" style={{ color: '#7A1E2D', fontWeight: 700 }}><Clock size={16}/> Total Duration</div>
                <div className="rd-box-value" style={{ fontSize: '15px', color: '#1E293B' }}>{diffHrs} hours</div>
              </div>

              <div className="rd-detail-box premium-rd-detail-card">
                <div className="rd-box-label" style={{ color: '#7A1E2D', fontWeight: 700 }}><Calendar size={16}/> Borrowing Schedule</div>
                <div className="rd-box-value schedule-value" style={{ fontSize: '14px', color: '#1E293B' }}>
                  <div><strong>Start:</strong> {startStr}</div>
                  <div><strong>End:</strong> {endStr}</div>
                </div>
              </div>
            </div>

            <div className="rd-footer-integrated">
              {showOfferButton && (
                <button 
                  type="button" 
                  className={`premium-lend-btn ${hasOffered ? 'disabled-btn' : ''}`} 
                  onClick={handleOffer} 
                  disabled={offering || hasOffered}
                  style={hasOffered ? { background: '#E2E8F0', cursor: 'not-allowed', color: '#94A3B8', border: '1px solid #E2E8F0', boxShadow: 'none' } : {}}
                >
                  {offering ? 'Submitting...' : hasOffered ? 'Offer Sent' : 'Offer to Lend'}
                </button>
              )}
            </div>
          </div>
        </div>
      {/* Confirmation Popup */}
      {confirmingOffer && (
        <div className="modal-overlay" style={{ zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px', position: 'relative', textAlign: 'center' }}>
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              onClick={() => setConfirmingOffer(null)}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '18px', color: '#7A1E2D', fontWeight: 700, marginTop: '8px', marginBottom: '16px' }}>
              Accept Offer?
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '24px' }}>
              You will accept <strong>{confirmingOffer.lenderName}'s</strong> offer. This borrowing request will now be hidden from everyone but you can view it on your requests tab.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmingOffer(null)}
                style={{ padding: '10px 20px', border: '1px solid #7A1E2D', color: '#7A1E2D', backgroundColor: 'transparent', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAccept(confirmingOffer.id)}
                style={{ padding: '10px 20px', border: 'none', color: '#FFFFFF', backgroundColor: '#7A1E2D', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default RequestDetailsModal;
