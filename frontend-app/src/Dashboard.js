import React, { useEffect, useState } from "react";
import { apiFetch, logout } from "./api";
import Chat from "./Chat";
import ImportPaper from "./ImportPaper";
import "./App.css";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("chat");

  useEffect(() => {
    apiFetch("/auth/me").then(setProfile);
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* Header Card */}
      <div className="card">
        <h2 className="dashboard-title">Dashboard</h2>

        {profile && (
          <div className="profile-info">
            <p><strong>ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}

        <div className="button-group">
          <button 
            className="chat-btn" 
            onClick={() => setPage("chat")}
          >
            Chat
          </button>

          <button 
            className="import-btn" 
            onClick={() => setPage("import")}
          >
            Import Paper
          </button>

          <button 
            className="logout-btn" 
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Content Card */}
      <div className="card">
        {page === "chat" ? <Chat /> : <ImportPaper />}
      </div>

    </div>
  );
}
