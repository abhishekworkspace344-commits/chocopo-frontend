import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const getToken = () => localStorage.getItem("admin_token");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setNotice("");

      const token = getToken();
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(response.data);
    } catch (error) {
      setNotice(
        error.response?.data?.message || "Could not load customer orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        { order_status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status, order_status: status } : order
        )
      );

      setNotice("Order status updated successfully.");
    } catch (error) {
      setNotice(
        error.response?.data?.message || "Could not update the order status."
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
          <h1>Orders</h1>
        </div>

        <div className="admin-topbar-actions">
          <Link to="/admin/dashboard" className="admin-outline-button">
            Dashboard
          </Link>
          <Link to="/admin/products" className="admin-outline-button">
            Products
          </Link>
          <Link to="/admin/categories" className="admin-outline-button">
            Categories
          </Link>
          <Link to="/admin/franchise-enquiries" className="admin-outline-button">
            Franchise
          </Link>
          <Link to="/admin/support-messages" className="admin-outline-button">
            Support
          </Link>
          <button type="button" className="admin-logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <main className="admin-content">
        <div className="admin-page-heading">
          <div>
            <h2>Customer Orders</h2>
            <p>Manage scheduled orders and update their preparation status.</p>
          </div>

          <button type="button" className="admin-refresh-button" onClick={loadOrders}>
            Refresh
          </button>
        </div>

        {notice && <div className="admin-message">{notice}</div>}

        {loading ? (
          <div className="admin-loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty-state">
            <div>🧁</div>
            <h3>No orders yet</h3>
            <p>Customer orders from the checkout page will appear here.</p>
          </div>
        ) : (
          <div className="admin-orders-grid">
            {orders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <div className="admin-order-top">
                  <div>
                    <span className={"order-status " + (order.status || order.order_status || "pending")}>
                      {(order.status || order.order_status || "pending").replace("_", " ")}
                    </span>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <strong className="order-total">
                    ₹{Number(order.total_amount || 0).toFixed(2)}
                  </strong>
                </div>

                <div className="admin-order-customer">
                  <p>
                    <strong>Customer:</strong> {order.customer_name || order.customer?.name || "Customer"}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customer_email || order.customer?.email || "Not provided"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customer_phone || order.customer?.phone || "Not provided"}
                  </p>
                </div>

                <div className="admin-order-schedule">
                  <p>
                    <strong>Pickup / Delivery Date:</strong>{" "}
                    {order.order_date || order.scheduled_date || "Not selected"}
                  </p>
                  <p>
                    <strong>Time Slot:</strong> {order.time_slot || "Not selected"}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.payment_method || "Not selected"}
                  </p>
                </div>

                <div className="admin-order-items">
                  <strong>Order Items</strong>
                  {order.items && order.items.length > 0 ? (
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.product_name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No item details available.</p>
                  )}
                </div>

                <div className="admin-order-status-control">
                  <label>Update Order Status</label>
                  <select
                    value={order.status || order.order_status || "pending"}
                    onChange={(event) =>
                      updateOrderStatus(order.id, event.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
