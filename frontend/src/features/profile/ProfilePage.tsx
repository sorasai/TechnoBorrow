import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { authApi } from "../auth/api";
import { ProfilePhotoSection } from "./ProfilePhotoSection";
import { EditProfileForm } from "./EditProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import Sidebar from "../../shared/ui/Sidebar";
import Header from "../../shared/ui/Header";
import "./profile.css";

function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            const user = authApi.getCurrentUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);
            setLoading(false);
        };
        loadUser();
    }, [navigate]);

    if (loading) return <div className="profile-container"><div className="profile-loading">Loading...</div></div>;

    const email = user.email ?? "";
    const fullName = user.fullName ?? "";
    const avatarUrl = user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : undefined;

    return (
        <div className="profile-container">
            <Sidebar />
            
            <div className="profile-main-area">
                <Header
                    avatarUrl={avatarUrl}
                    onProfileClick={() => navigate("/profile")}
                />

                <main className="profile-content">
                    <div className="profile-header">
                        <div className="profile-header__title-wrapper">
                            <div className="profile-header__icon">
                                <User size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="profile-header__title">My Profile</h1>
                                <p className="profile-header__subtitle">Manage your account information and preferences</p>
                            </div>
                        </div>
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

export default ProfilePage;
