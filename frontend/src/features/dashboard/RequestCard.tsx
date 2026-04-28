import React from "react";

interface RequestCardProps {
  itemName: string;
  description: string;
  requesterName: string;
  requesterImage?: string;
  createdAt: string;
  status: string;
  offerCount?: number;
  isOwner?: boolean;
  onViewDetails?: () => void;
  onViewOffers?: () => void;
  onConfirmBorrow?: () => void;
  onConfirmReturn?: () => void;
  confirmReturnLabel?: string;
  confirmReturnMessage?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  itemName,
  description,
  requesterName,
  requesterImage,
  createdAt,
  status,
  offerCount = 0,
  isOwner = false,
  onViewDetails,
  onViewOffers,
  onConfirmBorrow,
  onConfirmReturn,
  confirmReturnLabel,
  confirmReturnMessage,
}) => {
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

  const hasOffers = offerCount > 0;
  const isPosted = status.toUpperCase() === "POSTED";
  const showOwnerFeatures = isOwner && hasOffers && isPosted;

  return (
    <div className={`request-card ${isOwner && hasOffers ? 'has-offers' : ''}`}>
      <div className="request-card-header">
        <div className="request-card-user-info">
          <div className="request-card-avatar">
            <img 
              src={requesterImage ? `data:image/jpeg;base64,${requesterImage}` : `https://ui-avatars.com/api/?name=${requesterName.replace(' ', '+')}&background=random`} 
              alt={requesterName} 
            />
          </div>
          <div className="request-card-user-meta">
            <span className="request-card-requester">{requesterName}</span>
            <span className="request-card-date">{createdAt}</span>
          </div>
        </div>
        <span className={`request-card-status ${getStatusClass(status)}`}>
          {(status === 'BORROWER_RETURNED' || status === 'LENDER_RETURNED') ? 'BORROWED' : status}
        </span>
      </div>

      <div className="request-card-body">
        <h3 className="request-card-title" title={itemName}>
          {itemName}
        </h3>
        <p className="request-card-description" title={description}>
          {description}
        </p>
      </div>

      <div className="request-card-divider" />

      <div className="request-card-footer">
        {showOwnerFeatures && (
          <button className="request-card-offers-btn" onClick={onViewOffers}>
            View Offers ({offerCount})
          </button>
        )}
        {isOwner && status.toUpperCase() === "MATCHED" && (
          <button 
            className="request-card-confirm-borrow-btn" 
            onClick={onConfirmBorrow}
            style={{
              backgroundColor: 'transparent',
              color: '#F97316',
              border: '1.5px solid #F97316',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Confirm Item Received
          </button>
        )}
        
        {confirmReturnMessage && (
          <span style={{ fontSize: '12px', color: '#7A1E2D', fontStyle: 'italic', marginRight: 'auto', alignSelf: 'center', paddingLeft: '8px' }}>
            {confirmReturnMessage}
          </span>
        )}

        {confirmReturnLabel && onConfirmReturn && (
          <button 
            className="request-card-confirm-return-btn" 
            onClick={onConfirmReturn}
            style={{
              backgroundColor: 'transparent',
              color: '#047857',
              border: '1.5px solid #047857',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            {confirmReturnLabel}
          </button>
        )}

        <button className="request-card-action-btn" onClick={onViewDetails}>
          View Details &gt;
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
