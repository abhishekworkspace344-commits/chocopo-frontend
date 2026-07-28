import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";

  const handleLogin = async (event) => {
    event.preventDefault();

    if (isAdmin && !email) {
      setMessage("Enter your admin email and password.");
      return;
    }
    if (!isAdmin && !phone) {
      setMessage("Enter your phone number and password.");
      return;
    }
    if (!password) {
      setMessage("Enter your password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const endpoint = isAdmin ? "/admin/login" : "/auth/login";
      const payload = isAdmin ? { email, password } : { phone, password };
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      if (isAdmin) {
        localStorage.setItem("admin_token", response.data.access_token);
        localStorage.setItem("admin_data", JSON.stringify(response.data.admin));
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("customer_token", response.data.access_token);
        localStorage.setItem(
          "customer_data",
          JSON.stringify(response.data.customer)
        );
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("redirect") || "/menu";
        navigate(returnUrl);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not sign in. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="admin-login-container">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="auth-role-toggle">
            <button
              type="button"
              className={!isAdmin ? "active-role" : ""}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={isAdmin ? "active-role" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <p className="menu-kicker">{isAdmin ? "STAFF PORTAL" : "WELCOME BACK"}</p>
          <h1>{isAdmin ? "Staff Login" : "Sign In"}</h1>

          {message && <div className="menu-message">{message}</div>}

          {isAdmin ? (
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@chocopo.com"
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          )}

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

          {!isAdmin && (
            <p className="auth-switch">
              New to CHOCOPO? <Link to={`/register${window.location.search}`}>Create an account</Link>
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
