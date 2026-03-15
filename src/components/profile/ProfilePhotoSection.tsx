import React, { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

interface ProfilePhotoSectionProps {
    initialAvatarUrl: string | null;
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({ initialAvatarUrl }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
    const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    );
};
