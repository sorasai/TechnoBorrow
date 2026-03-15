import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";

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
