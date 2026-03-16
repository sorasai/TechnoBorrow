import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Sidebar from "../components/ui/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "linear-gradient(145deg, #5A0F1B 0%, #7A1E2D 50%, #F4B41A 100%)" }}>
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {/* Simple top bar with profile button */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "32px" }}>
          <button
            id="profile-btn"
            onClick={() => navigate("/profile")}
            title="My Profile"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(120, 55, 10, 0.40)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px", fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              padding: "9px 16px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(244,180,26,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(120,55,10,0.40)")}
          >
            <User size={16} /> My Profile
          </button>
        </div>

        <div style={{
          fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px",
          background: "linear-gradient(90deg, #FF7A2F 0%, #F4B41A 60%, #FFD35A 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "8px",
          display: "inline-block"
        }}>
          TechnoBorrow
        </div>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "28px", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
          Welcome to TechnoBorrow Dashboard
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "12px", fontSize: "15px" }}>
          More features coming soon.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

