import React from 'react';
import { ClipboardList, RefreshCw, Package } from 'lucide-react';

const StatsCards: React.FC = () => {
  return (
    <div className="dashboard-stats-grid">
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon-wrapper yellow">
          <ClipboardList size={24} color="#FFFFFF" />
        </div>
        <div>
          <h3 className="dashboard-stat-title">My Active Requests</h3>
          <p className="dashboard-stat-desc">
            Borrowing requests you have posted that are awaiting or in progress.
          </p>
        </div>
      </div>

      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon-wrapper orange">
          <RefreshCw size={24} color="#FFFFFF" />
        </div>
        <div>
          <h3 className="dashboard-stat-title">Ongoing Transactions</h3>
          <p className="dashboard-stat-desc">
            Active borrowing or lending transactions that require monitoring or action.
          </p>
        </div>
      </div>

      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon-wrapper green">
          <Package size={24} color="#FFFFFF" />
        </div>
        <div>
          <h3 className="dashboard-stat-title">Returned Transactions</h3>
          <p className="dashboard-stat-desc">
            Transactions that have been successfully completed and confirmed as returned.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
