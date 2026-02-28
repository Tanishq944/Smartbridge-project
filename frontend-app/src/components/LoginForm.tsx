// src/components/LoginForm.tsx
import React, { useState } from "react";
import { loginUser, LoginRequest } from "../api/auth";

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(form);
      onLoginSuccess(res.access_token);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !form.email || !form.password || loading;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        <label style={styles.label}>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            placeholder="test@example.com"
            required
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button} disabled={isDisabled}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  form: {
    background: "#ffffff",
    padding: "24px 32px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    minWidth: 320,
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    margin: 0,
    marginBottom: 8,
    textAlign: "center",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: 14,
    color: "#333",
  },
  input: {
    marginTop: 4,
    padding: "8px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    padding: "10px 12px",
    borderRadius: 4,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#b91c1c",
    fontSize: 13,
    background: "#fee2e2",
    padding: "6px 8px",
    borderRadius: 4,
  },
};

export default LoginForm;
