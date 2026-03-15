import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";

export const ChangePasswordForm: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

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

    return (
        <div className="profile-card">
            <p className="profile-section-title">Change Password</p>

            <InputField
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <InputField
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <InputField
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordMsg && (
                <div className={`profile-alert profile-alert--${passwordMsg.type}`}>
                    {passwordMsg.type === "success" ? "✓" : "⚠️"} {passwordMsg.text}
                </div>
            )}

            <div className="profile-card__footer">
                <Button
                    onClick={handleChangePassword}
                    loading={savingPassword}
                >
                    Update Password
                </Button>
            </div>
        </div>
    );
};
