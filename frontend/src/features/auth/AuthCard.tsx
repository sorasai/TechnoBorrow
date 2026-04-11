import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../shared/assets/TechnoBorrow_logo.png";

interface AuthCardProps {
    children: React.ReactNode;
    variant?: "login" | "register";
}

const AuthCard = ({ children, variant = "login" }: AuthCardProps) => {
    const navigate = useNavigate();

    return (
        <div className={`auth-page${variant === "register" ? " auth-page--register" : ""}`}>
            {/* Back button — top-left of the page */}
            <button className="auth-back-btn" onClick={() => navigate("/landing")}>
                ← Back
            </button>

            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo-section">
                    <div className="auth-logo-wrapper">
                        <img src={logo} alt="TechnoBorrow logo" />
                    </div>
                    <span className="auth-brand-name">TechnoBorrow</span>
                </div>

                {children}
            </div>
        </div>
    );
};

export default AuthCard;
