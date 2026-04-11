import React, { useState } from "react";
import { authApi } from "../auth/api";
import { InputField } from "../../shared/ui/InputField";
import { Button } from "../../shared/ui/Button";

interface EditProfileFormProps {
    initialFullName: string;
    email: string;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialFullName, email }) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    const handleSaveProfile = async () => {
        setProfileMsg(null);
        setSavingProfile(true);
        try {
            const user = authApi.getCurrentUser();
            if (!user?.id) throw new Error("No active session.");

            const response = await authApi.editProfile(user.id, { fullName });
            
            if (typeof response === "string" && response === "Profile Updated") {
                user.fullName = fullName;
                authApi.setCurrentUser(user);
                setProfileMsg({ type: "success", text: "Profile updated successfully." });
            } else if (typeof response === "string") {
                setProfileMsg({ type: "error", text: response });
            } else {
                setProfileMsg({ type: "error", text: "Failed to update profile." });
            }
        } catch (error: any) {
            setProfileMsg({ type: "error", text: "An error occurred connecting to the server." });
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="profile-card">
            <p className="profile-section-title">Personal Information</p>

            <InputField
                label="Full Name"
                type="text"
                placeholder="e.g. Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />

            <InputField
                label="Email Address"
                type="email"
                value={email}
                disabled
                title="Email cannot be changed here"
            />

            {profileMsg && (
                <div className={`profile-alert profile-alert--${profileMsg.type}`}>
                    {profileMsg.type === "success" ? "✓" : "⚠️"} {profileMsg.text}
                </div>
            )}

            <div className="profile-card__footer">
                <Button
                    onClick={handleSaveProfile}
                    loading={savingProfile}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
};
