import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../css/profile.css";

function Profile() {
    const navigate = useNavigate();

    // ── Profile fields ──────────────────────────────────────────
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    // ── Password fields ──────────────────────────────────────────
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

    // ── Avatar ───────────────────────────────────────────────────
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Load current user on mount ───────────────────────────────
    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setEmail(user.email ?? "");
            setFullName(user.user_metadata?.full_name ?? "");
            setAvatarUrl(user.user_metadata?.avatar_url ?? null);
        };
        loadUser();
    }, [navigate]);

    // ── Save profile info ────────────────────────────────────────
    const handleSaveProfile = async () => {
        setProfileMsg(null);
        setSavingProfile(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName },
        });
        setSavingProfile(false);
        if (error) {
            setProfileMsg({ type: "error", text: error.message });
        } else {
            setProfileMsg({ type: "success", text: "Profile updated successfully." });
        }
    };

    // ── Change password ──────────────────────────────────────────
    const handleChangePassword = async () => {
        setPasswordMsg(null);

        if (!newPassword || !confirmPassword) {
            setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: "error", text: "Passwords do not match." });
            return;
        }

        setSavingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setSavingPassword(false);

        if (error) {
            setPasswordMsg({ type: "error", text: error.message });
        } else {
            setPasswordMsg({ type: "success", text: "Password changed successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    // ── Upload avatar (client-side resize → base64 → user_metadata) ──────
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so the same file can be re-selected if needed
        e.target.value = "";

        setAvatarMsg(null);
        setUploadingAvatar(true);

        try {
            // 1. Convert file → data URL
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Failed to read file."));
                reader.readAsDataURL(file);
            });

            // 2. Draw onto a canvas and resize to max 256×256
            const compressed = await new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const MAX = 256;
                    let { width, height } = img;
                    if (width > MAX || height > MAX) {
                        const ratio = Math.min(MAX / width, MAX / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) { reject(new Error("Canvas not supported.")); return; }
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.82));
                };
                img.onerror = () => reject(new Error("Invalid image file."));
                img.src = dataUrl;
            });

            // 3. Save base64 into user_metadata
            const { error } = await supabase.auth.updateUser({
                data: { avatar_url: compressed },
            });

            if (error) throw error;

            setAvatarUrl(compressed);
            setAvatarMsg({ type: "success", text: "Photo updated successfully." });
        } catch (err: any) {
            setAvatarMsg({ type: "error", text: err?.message ?? "Upload failed." });
        } finally {
            setUploadingAvatar(false);
        }
    };


    // ── Logout ───────────────────────────────────────────────
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const handleRemoveAvatar = async () => {
        setAvatarMsg(null);
        const { error } = await supabase.auth.updateUser({ data: { avatar_url: null } });
        if (error) {
            setAvatarMsg({ type: "error", text: error.message });
        } else {
            setAvatarUrl(null);
            setAvatarMsg({ type: "success", text: "Photo removed." });
        }
    };

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

                {/* ── Photo Card ───────────────────────────────── */}
                <div className="profile-card">
                    <p className="profile-section-title">Profile Photo</p>
                    <div className="profile-avatar-section">
                        <label className="profile-avatar-ring" htmlFor="avatar-upload" title="Change photo">
                            {avatarUrl ? (
                                <img
                                    className="profile-avatar-img"
                                    src={avatarUrl}
                                    alt="Profile"
                                />
                            ) : (
                                <div className="profile-avatar-img--placeholder">👤</div>
                            )}
                            <div className="profile-avatar-overlay">📷</div>
                        </label>

                        <input
                            id="avatar-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="profile-avatar-input"
                            onChange={handleAvatarChange}
                        />

                        <label htmlFor="avatar-upload" className="profile-avatar-label">
                            {uploadingAvatar
                                ? "Uploading…"
                                : <><span>Click to upload</span> a photo (JPG, PNG)</>}
                        </label>

                        {avatarUrl && !uploadingAvatar && (
                            <button className="profile-avatar-remove" onClick={handleRemoveAvatar}>
                                Remove photo
                            </button>
                        )}

                        {avatarMsg && (
                            <div className={`profile-alert profile-alert--${avatarMsg.type}`}>
                                {avatarMsg.type === "success" ? "✓" : "⚠️"} {avatarMsg.text}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Edit Profile Card ─────────────────────────── */}
                <div className="profile-card">
                    <p className="profile-section-title">Personal Information</p>

                    <div className="profile-field">
                        <label className="profile-field__label">Full Name</label>
                        <input
                            className="profile-field__input"
                            type="text"
                            placeholder="e.g. Juan Dela Cruz"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-field__label">Email Address</label>
                        <input
                            className="profile-field__input"
                            type="email"
                            value={email}
                            disabled
                            title="Email cannot be changed here"
                        />
                    </div>

                    {profileMsg && (
                        <div className={`profile-alert profile-alert--${profileMsg.type}`}>
                            {profileMsg.type === "success" ? "✓" : "⚠️"} {profileMsg.text}
                        </div>
                    )}

                    <div className="profile-card__footer">
                        <button
                            className="profile-btn-primary"
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                        >
                            {savingProfile ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* ── Change Password Card ──────────────────────── */}
                <div className="profile-card">
                    <p className="profile-section-title">Change Password</p>

                    <div className="profile-field">
                        <label className="profile-field__label">Current Password</label>
                        <input
                            className="profile-field__input"
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-field__label">New Password</label>
                        <input
                            className="profile-field__input"
                            type="password"
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-field__label">Confirm New Password</label>
                        <input
                            className="profile-field__input"
                            type="password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {passwordMsg && (
                        <div className={`profile-alert profile-alert--${passwordMsg.type}`}>
                            {passwordMsg.type === "success" ? "✓" : "⚠️"} {passwordMsg.text}
                        </div>
                    )}

                    <div className="profile-card__footer">
                        <button
                            className="profile-btn-primary"
                            onClick={handleChangePassword}
                            disabled={savingPassword}
                        >
                            {savingPassword ? "Updating…" : "Update Password"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
