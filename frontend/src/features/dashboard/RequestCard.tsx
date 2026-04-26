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
}) => {
  const getStatusClass = (statusText: string) => {
    switch (statusText.toLowerCase()) {
      case "posted":
        return "status-badge-posted";
      case "pending":
        return "status-badge-pending";
      case "complete":
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
          {status}
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
        <button className="request-card-action-btn" onClick={onViewDetails}>
          View Details &gt;
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
