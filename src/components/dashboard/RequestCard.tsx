import React from "react";
import { User } from "lucide-react";

interface RequestCardProps {
  itemName: string;
  description: string;
  requesterName: string;
  createdAt: string;
  status: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  itemName,
  description,
  requesterName,
  createdAt,
  status,
}) => {
  // Simple helper to pick badge colors based on status
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

  return (
    <div className="request-card">
      <div className="request-card-header">
        <h3 className="request-card-title" title={itemName}>
          {itemName}
        </h3>
        <span
          className={`request-card-status ${getStatusClass(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="request-card-user-info">
        <div className="request-card-avatar">
          <img src={`https://ui-avatars.com/api/?name=${requesterName.replace(' ', '+')}&background=random`} alt={requesterName} />
        </div>
        <span className="request-card-requester">{requesterName}</span>
      </div>
      
      <p className="request-card-date">Posted {createdAt}</p>

      <div className="request-card-divider" />

      <p className="request-card-description" title={description}>
        {description}
      </p>

      <div className="request-card-divider" />

      <div className="request-card-footer">
        <button className="request-card-action-btn">
          View Details &gt;
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
