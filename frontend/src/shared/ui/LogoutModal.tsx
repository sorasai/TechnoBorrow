import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';
import './logout-modal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="logout-modal-overlay" onClick={onClose}>
      <div 
        className="logout-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-modal-icon-wrapper">
          <LogOut size={24} strokeWidth={2} />
        </div>
        <h3 className="logout-modal-title">Confirm Logout</h3>
        <p className="logout-modal-text">
          Are you sure you want to log out of TechnoBorrow? You will need to log in again to access your account.
        </p>
        <div className="logout-modal-actions">
          <button 
            className="logout-modal-btn logout-modal-btn-cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="logout-modal-btn logout-modal-btn-confirm" 
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;
