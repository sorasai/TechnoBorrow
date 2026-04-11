import React from "react";
interface AuthButtonProps {
    label: string;
    onClick: () => void;
}

const AuthButton = ({ label, onClick }: AuthButtonProps) => (
    <button className="auth-btn-primary" onClick={onClick}>
        {label}
    </button>
);

export default AuthButton;
