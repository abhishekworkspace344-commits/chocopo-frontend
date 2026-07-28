import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function AdminSupportMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [replyText, setReplyText] = useState({});

  const getToken = () => localStorage.getItem("admin_token");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setNotice("");

      const token = getToken();
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/admin/support/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessages(response.data);
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          "Could not load customer support messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/admin/support/messages/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages((currentMessages) =>
        currentMessages.map((item) =>
          item.id === messageId ? { ...item, is_read: true } : item
        )
      );

      setNotice("Message marked as read.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not update the message.");
    }
  };

  const sendReply = async (item) => {
    const reply = (replyText[item.id] || "").trim();

    if (!reply) {
      alert("Enter a reply before sending.");
      return;
    }

    if (!item.customer_email) {
      alert("This customer did not provide an email address.");
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/admin/support/reply`,
        {
          customer_name: item.customer_name || "Website Customer",
          customer_email: item.customer_email,
          message: reply
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReplyText((currentReplies) => ({
        ...currentReplies,
        [item.id]: ""
      }));

      setNotice("Reply sent successfully.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not send the reply.");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  const unreadCount = messages.filter((item) => !item.is_read).length;

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div>
          <p className="admin-kicker">CHOCOPO™ ADMIN</p>
          <h1>Support Messages</h1>
        </div>

        <div className="admin-topbar-actions">
          <Link to="/admin/dashboard" className="admin-outline-button">
            Dashboard
          </Link>
          <Link to="/admin/products" className="admin-outline-button">
            Products
          </Link>
          <Link to="/admin/franchise-enquiries" className="admin-outline-button">
            Franchise
          </Link>
          <button type="button" className="admin-logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <main className="admin-content">
        <div className="admin-page-heading">
          <div>
            <h2>Customer Questions and Complaints</h2>
            <p>
              {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}.
            </p>
          </div>

          <button type="button" className="admin-refresh-button" onClick={loadMessages}>
            Refresh
          </button>
        </div>

        {notice && <div className="admin-message">{notice}</div>}

        {loading ? (
          <div className="admin-loading">Loading support messages...</div>
        ) : messages.length === 0 ? (
          <div className="admin-empty-state">
            <div>💬</div>
            <h3>No support messages yet</h3>
            <p>Messages sent from the CHOCOPO chat button will appear here.</p>
          </div>
        ) : (
          <div className="admin-support-message-list">
            {messages.map((item) => (
              <article
                className={
                  "admin-support-message-card " + (item.is_read ? "read" : "unread")
                }
                key={item.id}
              >
                <div className="admin-support-message-top">
                  <div>
                    <span
                      className={
                        "support-read-status " + (item.is_read ? "read" : "unread")
                      }
                    >
                      {item.is_read ? "Read" : "New"}
                    </span>
                    <h3>{item.customer_name || "Website Customer"}</h3>
                    <p className="support-message-date">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="support-message-id">#{item.id}</span>
                </div>

                <div className="support-customer-details">
                  <p>
                    <strong>Email:</strong>{" "}
                    {item.customer_email ? (
                      <a href={"mailto:" + item.customer_email}>{item.customer_email}</a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="support-message-text">
                  <strong>Customer Message</strong>
                  <p>{item.message}</p>
                </div>

                {!item.is_read && (
                  <button
                    type="button"
                    className="mark-read-button"
                    onClick={() => markAsRead(item.id)}
                  >
                    Mark as Read
                  </button>
                )}

                <div className="admin-reply-box">
                  <label>Reply to Customer</label>
                  <textarea
                    value={replyText[item.id] || ""}
                    onChange={(event) =>
                      setReplyText((currentReplies) => ({
                        ...currentReplies,
                        [item.id]: event.target.value
                      }))
                    }
                    placeholder="Write your reply..."
                    rows="3"
                  />
                  <button
                    type="button"
                    className="mark-read-button"
                    onClick={() => sendReply(item)}
                  >
                    Send Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
