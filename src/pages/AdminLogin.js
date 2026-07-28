import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Enter your admin email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password
      });

      localStorage.setItem("admin_token", response.data.access_token);
      localStorage.setItem("admin_data", JSON.stringify(response.data.admin));

      navigate("/admin/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not sign in. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <nav className="navbar">
        <Link to="/" className="brand">
          CHOCOPO™
        </Link>

        <div className="nav-links">
          <Link to="/">Customer Website</Link>
        </div>
      </nav>

      <main className="admin-login-container">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <p className="menu-kicker">ADMIN</p>
          <h1>Staff Login</h1>

          {message && <div className="menu-message">{message}</div>}

          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@chocopo.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="place-order-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </main>
    </div>
  );
}
