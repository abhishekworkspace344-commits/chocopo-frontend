import Navbar from "../components/Navbar";
import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="success-page">
      <Navbar />

      <main className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <p className="menu-kicker">CONFIRMED</p>
          <h1>Thank you.</h1>

          <p className="success-text">
            Your order is scheduled. We'll have it ready for you.
          </p>

          <div className="order-confirmation-details">
            <div>
              <span>Order Number</span>
              <strong>{order.order_number}</strong>
            </div>

            <div>
              <span>Scheduled Date</span>
              <strong>{order.scheduled_date}</strong>
            </div>

            <div>
              <span>Pickup / Delivery Time</span>
              <strong>{order.time_slot}</strong>
            </div>

            <div>
              <span>Order Type</span>
              <strong>{order.order_type}</strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>₹{order.total_amount}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {order.payment_method === "online"
                  ? "Online payment pending"
                  : "Pay at pickup"}
              </strong>
            </div>
          </div>

          <Link to="/menu" className="order-button">
            Order More Items
          </Link>
        </div>
      </main>
    </div>
  );
}
