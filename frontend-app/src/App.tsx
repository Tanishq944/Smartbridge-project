import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { getMe, MeResponse } from "./api/user";

function App() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("access_token")
  );
  const [me, setMe] = useState<MeResponse | null>(null);
  const [meError, setMeError] = useState<string | null>(null);

  const handleLoginSuccess = (accessToken: string) => {
    setToken(accessToken);
    localStorage.setItem("access_token", accessToken);
  };

  const handleLogout = () => {
    setToken(null);
    setMe(null);
    localStorage.removeItem("access_token");
  };

  // When token changes (user logged in), load /users/me
  useEffect(() => {
    if (!token) return;

    const loadMe = async () => {
      try {
        setMeError(null);
        const data = await getMe(token);
        setMe(data);
      } catch (err: any) {
        setMeError(err.message || "Failed to load profile");
      }
    };

    loadMe();
  }, [token]);

  return (
    <>
      {!token ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div style={{ padding: 24 }}>
          <h2>Logged in!</h2>
          <p>Your token starts with:</p>
          <code>{token.slice(0, 32)}...</code>

          <hr style={{ margin: "16px 0" }} />

          <h3>User profile</h3>
          {meError && <p style={{ color: "red" }}>{meError}</p>}
          {me ? (
            <ul>
              <li>ID: {me.id}</li>
              <li>Email: {me.email}</li>
              {/* show more fields if available */}
            </ul>
          ) : (
            <p>Loading profile...</p>
          )}

          <button onClick={handleLogout} style={{ marginTop: 16 }}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default App;
