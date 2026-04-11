import React from 'react';
import { X, Calendar, Clock, Target } from 'lucide-react';

interface RequestDetailsModalProps {
  request: any;
  onClose: () => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose }) => {
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
              <button type="button" className="rd-lend-btn" onClick={() => alert('Lend feature coming soon!')}>
                Offer to Lend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
