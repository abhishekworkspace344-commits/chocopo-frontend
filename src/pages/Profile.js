import axios from "axios";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const getCustomerToken = () => localStorage.getItem("customer_token");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setNotice("");

      const token = getCustomerToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/customer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone: response.data.phone || ""
      });
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!profile.full_name.trim() || !profile.phone.trim()) {
      setNotice("Please enter your name and phone number.");
      return;
    }

    try {
      setSaving(true);
      setNotice("");

      const token = getCustomerToken();
      const response = await axios.put(
        `${API_BASE_URL}/customer/profile`,
        {
          full_name: profile.full_name,
          phone: profile.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedCustomer = response.data.customer;
      setProfile({
        full_name: updatedCustomer.full_name || "",
        email: updatedCustomer.email || "",
        phone: updatedCustomer.phone || ""
      });

      localStorage.setItem("customer_data", JSON.stringify(updatedCustomer));
      setNotice("Your profile was updated successfully.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_data");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "C"}
            </div>

            <div>
              <p className="menu-kicker">MY ACCOUNT</p>
              <h1>My Profile</h1>
              <p>Manage your CHOCOPO account details.</p>
            </div>
          </div>

          {notice && <div className="profile-notice">{notice}</div>}

          {loading ? (
            <div className="profile-loading">Loading profile...</div>
          ) : (
            <form className="profile-form" onSubmit={saveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={updateProfile}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={profile.email} disabled />
                <small>Email address cannot be changed.</small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={updateProfile}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="place-order-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="profile-logout-button"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="chocopo-footer">
        <div className="footer-bottom">
          <span>© 2026 CHOCOPO. All rights reserved.</span>
          <span>Made with chocolate and love.</span>
        </div>
      </footer>
    </div>
  );
}
