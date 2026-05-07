import React from "react";
import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

interface RegisterFormProps {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreed: boolean;
    error: string;
    onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAgreedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

const RegisterForm = ({
    fullName,
    email,
    password,
    confirmPassword,
    agreed,
    error,
    onFullNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onAgreedChange,
    onSubmit,
    isLoading,
}: RegisterFormProps) => (
    <AuthCard variant="register">
        {/* Heading */}
        <div className="auth-heading">
            <h1 className="auth-heading__title">Create Account</h1>
            <p className="auth-heading__subtitle">Join the TechnoBorrow community</p>
        </div>

        {/* Fields */}
        <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={onFullNameChange}
        />
        <AuthInput
            label="CIT-U Email"
            type="email"
            placeholder="e.g. firstname.lastname@cit.edu"
            value={email}
            onChange={onEmailChange}
        />
        <AuthInput
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={onPasswordChange}
        />
        <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
        />

        {/* Terms checkbox */}
        <label className="auth-checkbox">
            <input
                type="checkbox"
                className="auth-checkbox__input"
                checked={agreed}
                onChange={onAgreedChange}
            />
            <span className="auth-checkbox__label">
                By creating an account, you agree to the{" "}
                <span className="auth-checkbox__link">Terms and Conditions</span>
            </span>
        </label>

        {/* Error */}
        {error && (
            <div className="auth-error">
                <span className="auth-error__icon">⚠️</span>
                {error}
            </div>
        )}

        {/* Submit */}
        <AuthButton label={isLoading ? "Registering.." : "Register"} onClick={onSubmit} disabled={isLoading} />

        {/* Bottom link */}
        <p className="auth-bottom-link">
            Already have an account? <Link to="/login">Login</Link>
        </p>
    </AuthCard>
);

export default RegisterForm;
