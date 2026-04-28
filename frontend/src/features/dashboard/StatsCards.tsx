import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, RefreshCw, Package } from 'lucide-react';

interface StatsCardsProps {
  hasOngoingTransactions?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ hasOngoingTransactions = false }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-stats-grid">
      <div 
        className="dashboard-stat-card clickable-card" 
        onClick={() => navigate('/my-requests')}
        style={{ cursor: 'pointer' }}
      >
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

      <div 
        className={`dashboard-stat-card clickable-card ${hasOngoingTransactions ? 'highlighted-card' : ''}`}
        onClick={() => navigate('/my-transactions')}
        style={{ cursor: 'pointer' }}
      >
        <div className="dashboard-stat-icon-wrapper orange">
          <RefreshCw size={24} color="#FFFFFF" />
        </div>
        <div>
          <h3 className="dashboard-stat-title">Ongoing Transactions</h3>
          <p className="dashboard-stat-desc">
            Active lending transactions that require monitoring or action.
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
