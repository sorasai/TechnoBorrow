import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(145deg, #5A0F1B 0%, #7A1E2D 50%, #F4B41A 100%)", padding: "24px" }}>
      {/* Simple top bar with profile button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <span style={{
          fontSize: "20px", fontWeight: 800, letterSpacing: "-0.4px",
          background: "linear-gradient(90deg, #FF7A2F 0%, #F4B41A 60%, #FFD35A 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          TechnoBorrow
        </span>

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
          👤 My Profile
        </button>
      </div>

      <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "24px", margin: 0 }}>
        Welcome to TechnoBorrow Dashboard
      </h2>
      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "8px", fontSize: "14px" }}>
        More features coming soon.
      </p>
    </div>
  );
}

export default Dashboard;

