import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="dashboard-empty-state">
      <p className="dashboard-empty-title">
        No borrowing requests available at the moment.
      </p>
      <p className="dashboard-empty-subtext">
        Be the first to post a request.
      </p>
    </div>
  );
};

export default EmptyState;
