import axios from "axios";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const getCustomerToken = () => localStorage.getItem("customer_token");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setNotice("");

      const token = getCustomerToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(response.data);
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelOrder = async (orderId) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!shouldCancel) {
      return;
    }

    try {
      const token = getCustomerToken();
      await axios.put(
        `${API_BASE_URL}/my-orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled", order_status: "cancelled" } : order
        )
      );

      setNotice("Your order has been cancelled.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not cancel this order.");
    }
  };

  return (
    <div className="my-orders-page">
      <Navbar />

      <main className="my-orders-content">
        <div className="my-orders-heading">
          <div>
            <p className="menu-kicker">MY CHOCOPO ORDERS</p>
            <h1>Track your sweet orders.</h1>
            <p>View your scheduled order details and the latest preparation status.</p>
          </div>

          <button type="button" className="pink-main-button" onClick={loadOrders}>
            Refresh Orders
          </button>
        </div>

        {notice && <div className="my-orders-notice">{notice}</div>}

        {loading ? (
          <div className="my-orders-empty">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="my-orders-empty">
            <div>🧁</div>
            <h2>No orders yet</h2>
            <p>Your CHOCOPO orders will appear here after checkout.</p>
            <Link to="/menu" className="pink-main-button">
              Explore Our Products
            </Link>
          </div>
        ) : (
          <div className="my-orders-grid">
            {orders.map((order) => (
              <article className="my-order-card" key={order.id}>
                <div className="my-order-card-top">
                  <div>
                    <span className={"order-status " + (order.status || order.order_status || "pending")}>
                      {(order.status || order.order_status || "pending").replace("_", " ")}
                    </span>
                    <h2>Order #{order.id}</h2>
                    <p>Ordered on {new Date(order.created_at).toLocaleString()}</p>
                  </div>

                  <strong>₹{Number(order.total_amount || 0).toFixed(2)}</strong>
                </div>

                <div className="my-order-details">
                  <p>
                    <strong>Scheduled Date:</strong>{" "}
                    {order.order_date || order.scheduled_date || "Not selected"}
                  </p>
                  <p>
                    <strong>Time Slot:</strong> {order.time_slot || "Not selected"}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.payment_method || "Not selected"}
                  </p>
                </div>

                <div className="my-order-items">
                  <h3>Your Items</h3>
                  {order.items && order.items.length > 0 ? (
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          <span>{item.product_name}</span>
                          <span>x {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Item details are not available.</p>
                  )}
                </div>

                <div className="my-order-status-note">
                  <strong>Order Status:</strong>{" "}
                  {(order.status || order.order_status || "pending").replace("_", " ")}
                </div>

                {(order.status === "pending" || order.status === "confirmed" || order.order_status === "pending" || order.order_status === "confirmed") && (
                  <button
                    type="button"
                    className="cancel-order-button"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
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
