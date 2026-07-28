import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function AdminFranchiseEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("admin_token");

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = getToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/admin/franchise-enquiries`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEnquiries(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not load franchise enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (enquiryId, status) => {
    try {
      const token = getToken();

      await axios.put(
        `${API_BASE_URL}/admin/franchise-enquiries/${enquiryId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((enquiry) =>
          enquiry.id === enquiryId
            ? { ...enquiry, status }
            : enquiry
        )
      );

      setMessage("Franchise enquiry status updated successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not update enquiry status."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div>
          <p className="admin-kicker">CHOCOPO™ ADMIN</p>
          <h1>Franchise Enquiries</h1>
        </div>

        <div className="admin-topbar-actions">
          <Link to="/admin/dashboard" className="admin-outline-button">
            Dashboard
          </Link>

          <Link to="/admin/products" className="admin-outline-button">
            Products
          </Link>

          <button type="button" className="admin-logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <main className="admin-content">
        <div className="admin-page-heading">
          <div>
            <h2>Partner Applications</h2>
            <p>Review and manage franchise enquiries submitted from the website.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadEnquiries}
          >
            Refresh
          </button>
        </div>

        {message && <div className="admin-message">{message}</div>}

        {loading ? (
          <div className="admin-loading">Loading franchise enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="admin-empty-state">
            <div>📩</div>
            <h3>No franchise enquiries yet</h3>
            <p>New franchise applications will appear here.</p>
          </div>
        ) : (
          <div className="admin-enquiry-grid">
            {enquiries.map((enquiry) => (
              <article className="admin-enquiry-card" key={enquiry.id}>
                <div className="admin-enquiry-card-top">
                  <div>
                    <span className={`enquiry-status ${enquiry.status}`}>
                      {enquiry.status.replace("_", " ")}
                    </span>

                    <h3>{enquiry.full_name}</h3>
                    <p className="enquiry-date">
                      {new Date(enquiry.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="enquiry-id">#{enquiry.id}</span>
                </div>

                <div className="enquiry-details">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                  </p>

                  <p>
                    <strong>Preferred City:</strong> {enquiry.city}
                  </p>

                  <p>
                    <strong>Investment Range:</strong> {enquiry.investment}
                  </p>
                </div>

                {enquiry.message && (
                  <div className="enquiry-message-box">
                    <strong>Message</strong>
                    <p>{enquiry.message}</p>
                  </div>
                )}

                <div className="enquiry-status-actions">
                  <label>Update Status</label>

                  <select
                    value={enquiry.status}
                    onChange={(event) =>
                      updateStatus(enquiry.id, event.target.value)
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}