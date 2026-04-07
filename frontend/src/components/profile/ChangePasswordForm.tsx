import React, { useState } from "react";
import { authApi } from "../../api/auth";
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
        try {
            const user = authApi.getCurrentUser();
            if (!user?.id) throw new Error("No active session.");

            const response = await authApi.changePassword(user.id, { newPassword });
            
            if (typeof response === "string" && response === "Password Changed Successfully") {
                setPasswordMsg({ type: "success", text: "Password changed successfully." });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else if (typeof response === "string") {
                setPasswordMsg({ type: "error", text: response });
            } else {
                setPasswordMsg({ type: "error", text: "Failed to change password." });
            }
        } catch (error: any) {
            setPasswordMsg({ type: "error", text: "An error occurred connecting to the server." });
        } finally {
            setSavingPassword(false);
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
