import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="request-card skeleton-card">
      <div className="request-card-header">
        <div className="request-card-user-info">
          <div className="request-card-avatar skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
          <div className="request-card-user-meta">
            <div className="skeleton" style={{ width: '100px', height: '14px', marginBottom: '6px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '4px' }}></div>
          </div>
        </div>
        <div className="skeleton" style={{ width: '70px', height: '24px', borderRadius: '12px' }}></div>
      </div>

      <div className="request-card-body">
        <div className="skeleton" style={{ width: '60%', height: '18px', marginBottom: '12px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '8px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }}></div>
      </div>

      <div className="request-card-divider" />

      <div className="request-card-footer" style={{ justifyContent: 'flex-end' }}>
        <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }}></div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="requests-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 4 }) => {
  return (
    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
      {Array.from({ length: cols }).map((_, index) => (
        <td key={index} style={{ padding: '16px' }}>
          <div className="skeleton" style={{ width: '80%', height: '16px', borderRadius: '4px' }}></div>
        </td>
      ))}
    </tr>
  );
};
