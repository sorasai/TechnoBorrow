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
    <div className="modal-overlay">
      <div className="modal-content request-details-modal">
        <div className="modal-header">
          <h2 className="modal-title">Request Details</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={24} />
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

            <div className="rd-title-section">
              <h3 className="rd-item-name">{request.itemName}</h3>
              <p className="rd-description">{request.description}</p>
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
              <div className="rd-user-row">
                <img src={userImageSrc} alt={request.requesterName} className="rd-user-avatar" />
                <div className="rd-user-text">
                  <div className="rd-user-name">{request.requesterName}</div>
                  <div className="rd-post-date">Posted {postedStr}</div>
                </div>
              </div>
              <div className={`rd-status-badge rd-status-${request.status?.toLowerCase()}`}>
                {request.status}
              </div>
            </div>

            <hr className="modal-divider rd-divider-local" />

            <div className="rd-details-grid-vertical">
              <div className="rd-detail-box">
                <div className="rd-box-label"><Target size={16}/> Purpose</div>
                <div className="rd-box-value">{request.purpose}</div>
              </div>
              
              <div className="rd-detail-box">
                <div className="rd-box-label"><Clock size={16}/> Total Duration</div>
                <div className="rd-box-value">{diffHrs} hours</div>
              </div>

              <div className="rd-detail-box">
                <div className="rd-box-label"><Calendar size={16}/> Borrowing Schedule</div>
                <div className="rd-box-value schedule-value">
                  <div><strong>Start:</strong> {startStr}</div>
                  <div><strong>End:</strong> {endStr}</div>
                </div>
              </div>
            </div>

            <div className="rd-footer-integrated">
              {showOfferButton && (
                <button 
                  type="button" 
                  className={`rd-lend-btn ${hasOffered ? 'disabled-btn' : ''}`} 
                  onClick={handleOffer} 
                  disabled={offering || hasOffered}
                  style={hasOffered ? { backgroundColor: '#D1D5DB', cursor: 'not-allowed', color: '#6B7280', border: '1px solid #D1D5DB' } : {}}
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
