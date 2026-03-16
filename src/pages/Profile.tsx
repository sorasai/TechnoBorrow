import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../css/profile.css";
import { ProfilePhotoSection } from "../components/profile/ProfilePhotoSection";
import { EditProfileForm } from "../components/profile/EditProfileForm";
import { ChangePasswordForm } from "../components/profile/ChangePasswordForm";
import Sidebar from "../components/ui/Sidebar";

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

    if (loading) return <div className="profile-page"><div className="profile-loading">Loading...</div></div>;

    const email = user.email ?? "";
    const fullName = user.user_metadata?.full_name ?? "";
    const avatarUrl = user.user_metadata?.avatar_url ?? null;

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #5A0F1B 0%, #7A1E2D 50%, #F4B41A 100%)" }}>
            <Sidebar />
            
            <div className="profile-page" style={{ flex: 1, background: "transparent" }}>
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
        </div>
    );
}

export default Profile;
