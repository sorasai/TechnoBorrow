import React from 'react';
import { User } from 'lucide-react';

interface HeaderProps {
  avatarUrl?: string;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ avatarUrl, onProfileClick }) => {
  return (
    <header className="header">
      <h1 className="header-title">TechnoBorrow</h1>
      <div 
        className="profile-avatar" 
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

export default Header;
