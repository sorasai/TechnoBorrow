import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

interface LoginFormProps {
    email: string;
    password: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

const LoginForm = ({
    email,
    password,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: LoginFormProps) => {
    return (
        <AuthCard>

            {/* Heading */}
            <div className="auth-heading">
                <h1 className="auth-heading__title">Sign In</h1>
                <p className="auth-heading__subtitle">Access your TechnoBorrow account</p>
            </div>

            {/* Inputs */}
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
                placeholder="Enter your password"
                value={password}
                onChange={onPasswordChange}
            />

            {/* Error */}
            {error && (
                <div className="auth-error">
                    <span className="auth-error__icon">⚠️</span>
                    {error}
                </div>
            )}

            {/* Submit */}
            <AuthButton label="Sign In" onClick={onSubmit} />

            {/* Bottom link */}
            <p className="auth-bottom-link">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </AuthCard>
    );
};

export default LoginForm;
