import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../css/profile.css";
import { ProfilePhotoSection } from "../components/profile/ProfilePhotoSection";
import { EditProfileForm } from "../components/profile/EditProfileForm";
import { ChangePasswordForm } from "../components/profile/ChangePasswordForm";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // ── Load current user on mount ───────────────────────────────
    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);
            setLoading(false);
        };
        loadUser();
    }, [navigate]);

    // Logout 
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (loading) return <div className="profile-page"><div className="profile-loading">Loading...</div></div>;

    const email = user.email ?? "";
    const fullName = user.user_metadata?.full_name ?? "";
    const avatarUrl = user.user_metadata?.avatar_url ?? null;

    return (
        <div className="profile-page">
            {/* Navbar */}
            <nav className="profile-navbar">
                <button className="profile-navbar__back" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
                <span className="profile-navbar__brand">TechnoBorrow</span>
                <button className="profile-navbar__logout" onClick={handleLogout}>
                    Sign Out
                </button>
            </nav>

            {/* Content */}
            <main className="profile-content">
                {/* Page Heading */}
                <div className="profile-header">
                    <h1 className="profile-header__title">My Profile</h1>
                    <p className="profile-header__subtitle">Manage your account information</p>
                </div>

                <div className="profile-grid">
                    <div className="profile-col">
                        <ProfilePhotoSection initialAvatarUrl={avatarUrl} />
                        <EditProfileForm initialFullName={fullName} email={email} />
                    </div>
                    <div className="profile-col">
                        <ChangePasswordForm />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
