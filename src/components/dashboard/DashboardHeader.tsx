import React from 'react';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  avatarUrl?: string;
  onProfileClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ avatarUrl, onProfileClick }) => {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-header-title">TechnoBorrow</h1>
      <div 
        className="dashboard-profile-avatar" 
        onClick={onProfileClick} 
        title="Go to Profile"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" />
        ) : (
          <User size={20} color="#6B7280" />
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
