import React from 'react';

interface DashboardWelcomeProps {
  firstName: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ firstName }) => {
  return (
    <div className="dashboard-welcome">
      <h2 className="dashboard-welcome-title">
        Hello, {firstName}!
      </h2>
      <p className="dashboard-welcome-subtitle">
        Manage your borrowing requests, monitor active transactions, and explore equipment posted by fellow Teknoys.
      </p>
    </div>
  );
};

export default DashboardWelcome;
