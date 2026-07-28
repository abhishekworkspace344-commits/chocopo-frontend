import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setMessage("Fill in your name, email, phone, and password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });

      localStorage.setItem("customer_token", response.data.access_token);
      localStorage.setItem(
        "customer_data",
        JSON.stringify(response.data.customer)
      );

      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = searchParams.get("redirect") || "/menu";
      navigate(returnUrl);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="admin-login-container">
        <form className="admin-login-card" onSubmit={handleRegister}>
          <p className="menu-kicker">JOIN CHOCOPO</p>
          <h1>Create Account</h1>

          {message && <div className="menu-message">{message}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={updateForm}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateForm}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateForm}
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={updateForm}
              placeholder="Re-enter password"
            />
          </div>

          <button type="submit" className="place-order-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to={`/login${window.location.search}`}>Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
