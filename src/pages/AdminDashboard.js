import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

const statuses = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
  "rejected"
];

function getTodayDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const admin = JSON.parse(localStorage.getItem("admin_data") || "null");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      let url = `${API_BASE_URL}/admin/orders?date=${selectedDate}`;
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_data");
        navigate("/admin/login");
        return;
      }
      setMessage(
        error.response?.data?.message ||
          "Could not load orders. Check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        { order_status: orderStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Order status updated.");
      loadOrders();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not update order status."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-page">
      <nav className="navbar">
        <Link to="/" className="brand">CHOCOPO™ ADMIN</Link>
        <div className="nav-links">
          <Link to="/admin/dashboard" style={{ marginRight: 15 }}>Orders</Link>
          <Link to="/admin/products" style={{ marginRight: 15 }}>Products</Link>
          <Link to="/admin/categories" style={{ marginRight: 15 }}>Categories</Link>
          <span className="admin-name">{admin?.full_name || "Admin"}</span>
          <button className="admin-logout-button" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div>
            <p className="menu-kicker">ORDERS</p>
            <h1>Dashboard</h1>
          </div>
        </div>

        {message && <div className="menu-message">{message}</div>}

        <section className="admin-filters">
          <div className="form-group">
            <label>Scheduled Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Order Status</label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="refresh-orders-button" onClick={loadOrders}>
            Refresh Orders
          </button>
        </section>

        {loading ? (
          <div className="menu-loading">Loading scheduled orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty-orders">
            No scheduled orders found for this date.
          </div>
        ) : (
          <section className="admin-orders-list">
            {orders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <div className="admin-order-top">
                  <div>
                    <p className="order-number">{order.order_number}</p>
                    <h3>{order.customer.name}</h3>
                    <p>{order.customer.phone}</p>
                  </div>

                  <span className={`status-badge status-${order.order_status}`}>
                    {order.order_status}
                  </span>
                </div>

                <div className="admin-order-info">
                  <div>
                    <span>Schedule</span>
                    <strong>
                      {order.scheduled_date} · {order.time_slot}
                    </strong>
                  </div>

                  <div>
                    <span>Type</span>
                    <strong>{order.order_type}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>₹{order.total_amount}</strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.payment_method === "online"
                        ? "Online"
                        : "Pay at pickup"}
                    </strong>
                  </div>
                </div>

                {order.delivery_address && (
                  <div className="admin-order-note">
                    <strong>Delivery address:</strong> {order.delivery_address}
                  </div>
                )}

                {order.notes && (
                  <div className="admin-order-note">
                    <strong>Customer note:</strong> {order.notes}
                  </div>
                )}

                <div className="admin-order-items">
                  <strong>Items</strong>

                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="admin-order-item">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <b>₹{item.total_price}</b>
                    </div>
                  ))}
                </div>

                <div className="admin-status-actions">
                  <label>Update status</label>
                  <select
                    value={order.order_status}
                    onChange={(event) =>
                      updateOrderStatus(order.id, event.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
