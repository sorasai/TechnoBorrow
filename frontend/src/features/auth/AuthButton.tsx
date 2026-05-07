import React from "react";
interface AuthButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const AuthButton = ({ label, onClick, disabled }: AuthButtonProps) => (
    <button className="auth-btn-primary" onClick={onClick} disabled={disabled}>
        {label}
    </button>
);

export default AuthButton;
