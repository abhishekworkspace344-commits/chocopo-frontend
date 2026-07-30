import Navbar from "../components/Navbar";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

function getTodayDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

/** Dynamically load the Razorpay checkout script once */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id  = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems]     = useState([]);
  const [timeSlots, setTimeSlots]     = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [processing, setProcessing]   = useState(false);
  const [message, setMessage]         = useState("");

  const [form, setForm] = useState(() => {
    let customerData = {};
    try {
      customerData = JSON.parse(localStorage.getItem("customer_data") || "{}");
    } catch (e) {}

    return {
      fullName:        customerData.full_name || "",
      phone:           customerData.phone || "",
      email:           customerData.email || "",
      orderType:       "pickup",
      deliveryAddress: "",
      scheduledDate:   getTodayDate(),
      timeSlotId:      "",
      notes:           "",
      paymentMethod:   "online"
    };
  });

  // ── Auth & Cart Load ────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      navigate("/login?redirect=/checkout");
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("chocopo_cart") || "[]");
    if (savedCart.length === 0) { navigate("/menu"); return; }
    setCartItems(savedCart);
  }, [navigate]);

  // ── Load time slots whenever date changes ───────────────────────
  useEffect(() => {
    loadTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.scheduledDate]);

  const loadTimeSlots = async () => {
    setTimeSlots([]);
    setForm((f) => ({ ...f, timeSlotId: "" }));
    try {
      setLoadingSlots(true);
      const res = await axios.get(`${API_BASE_URL}/time-slots?date=${form.scheduledDate}`);
      setTimeSlots(res.data);
    } catch (err) {
      console.error("Could not load time slots:", err);
      setMessage("Could not load pickup slots. Please make sure the server is running.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // ── Derived totals ──────────────────────────────────────────────
  const subtotal = useMemo(
    () => cartItems.reduce((t, item) => t + Number(item.price) * item.quantity, 0),
    [cartItems]
  );
  const deliveryFee  = form.orderType === "delivery" ? 40 : 0;
  const totalAmount  = subtotal + deliveryFee;

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ── Main handler: validate → create Razorpay order → open modal ─
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.phone || !form.scheduledDate || !form.timeSlotId) {
      setMessage("Please enter your name, phone number, date, and pickup time.");
      return;
    }
    if (form.orderType === "delivery" && !form.deliveryAddress.trim()) {
      setMessage("Please enter the delivery address.");
      return;
    }

    setProcessing(true);
    setMessage("Initialising payment…");

    // 1. Load Razorpay SDK
    const sdkReady = await loadRazorpayScript();
    if (!sdkReady) {
      setMessage("Failed to load payment gateway. Check your internet connection.");
      setProcessing(false);
      return;
    }

    // 2. Ask backend to create a Razorpay order & validate cart
    let paymentData;
    try {
      const res = await axios.post(`${API_BASE_URL}/payment/create-order`, {
        full_name:        form.fullName,
        phone:            form.phone,
        email:            form.email,
        order_type:       form.orderType,
        delivery_address: form.deliveryAddress,
        scheduled_date:   form.scheduledDate,
        time_slot_id:     Number(form.timeSlotId),
        notes:            form.notes,
        items:            cartItems.map((item) => ({
          product_id: item.id,
          quantity:   item.quantity
        }))
      });
      paymentData = res.data;
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not initiate payment. Please try again.");
      setProcessing(false);
      return;
    }

    // 3. Open Razorpay checkout modal
    const options = {
      key:      paymentData.key,
      amount:   paymentData.amount,
      currency: paymentData.currency,
      name:     "CHOCOPO™",
      description: `Order — ₹${totalAmount}`,
      image:    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop",
      order_id: paymentData.razorpay_order_id,

      prefill: {
        name:    form.fullName,
        email:   form.email,
        contact: form.phone
      },

      theme: { color: "#c97f98" },

      // ── Payment succeeded ─────────────────────────────────────────
      handler: async (response) => {
        setMessage("Payment received! Confirming your order…");
        try {
          const verifyRes = await axios.post(`${API_BASE_URL}/payment/verify`, {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            // send order details so backend can save the order
            full_name:        form.fullName,
            phone:            form.phone,
            email:            form.email,
            order_type:       form.orderType,
            delivery_address: form.deliveryAddress,
            scheduled_date:   form.scheduledDate,
            time_slot_id:     Number(form.timeSlotId),
            notes:            form.notes,
            items:            cartItems.map((item) => ({
              product_id: item.id,
              quantity:   item.quantity
            }))
          });

          localStorage.removeItem("chocopo_cart");
          navigate("/order-success", { state: { order: verifyRes.data.order } });
        } catch (err) {
          setMessage(
            err.response?.data?.message ||
            "Payment successful but order could not be saved. Please contact support."
          );
          setProcessing(false);
        }
      },

      // ── Modal dismissed without paying ───────────────────────────
      modal: {
        ondismiss: () => {
          setMessage("Payment cancelled. Your cart is still saved.");
          setProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);

    // Handle payment failure inside the modal
    rzp.on("payment.failed", (response) => {
      setMessage(`Payment failed: ${response.error.description}. Please try again.`);
      setProcessing(false);
    });

    rzp.open();
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-container">
        <section className="checkout-form-section">
          <p className="menu-kicker">CHECKOUT</p>
          <h2>Schedule your order</h2>

          {message && (
            <div className={`menu-message ${processing ? "menu-message--processing" : ""}`}>
              {processing && <span className="spinner" />}
              {message}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="checkout-form">

            {/* ── Name + Phone ── */}
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={updateForm}
                  placeholder="Enter your name"
                  disabled={processing}
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="Enter your phone number"
                  disabled={processing}
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateForm}
                placeholder="Enter your email (for receipt)"
                disabled={processing}
              />
            </div>

            {/* ── Order type ── */}
            <div className="form-group">
              <label>Order Type *</label>
              <div className="order-type-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={form.orderType === "pickup"}
                    onChange={updateForm}
                    disabled={processing}
                  />
                  Pickup from café
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={form.orderType === "delivery"}
                    onChange={updateForm}
                    disabled={processing}
                  />
                  Delivery
                </label>
              </div>
            </div>

            {/* ── Delivery address ── */}
            {form.orderType === "delivery" && (
              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={updateForm}
                  placeholder="House / building, street, area, landmark"
                  rows="3"
                  disabled={processing}
                />
              </div>
            )}

            {/* ── Date + Time slot ── */}
            <div className="form-grid">
              <div className="form-group">
                <label>Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  min={getTodayDate()}
                  value={form.scheduledDate}
                  onChange={updateForm}
                  disabled={processing}
                />
              </div>
              <div className="form-group">
                <label>Pickup Time *</label>
                <select
                  name="timeSlotId"
                  value={form.timeSlotId}
                  onChange={updateForm}
                  disabled={loadingSlots || processing}
                >
                  <option value="">
                    {loadingSlots
                      ? "Loading slots…"
                      : timeSlots.length === 0
                      ? "No slots available"
                      : "Select a time slot"}
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id} disabled={!slot.is_available}>
                      {slot.label}
                      {!slot.is_available
                        ? " — Full"
                        : slot.remaining_orders <= 3
                        ? ` (${slot.remaining_orders} left)`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Special instructions ── */}
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={updateForm}
                placeholder="Less sugar, no nuts, birthday message, etc."
                rows="3"
                disabled={processing}
              />
            </div>

            {/* ── Payment badge ── */}
            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-online-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Secure Online Payment via Razorpay</span>
              </div>
            </div>

            {/* ── CTA ── */}
            <button
              type="submit"
              className="place-order-button razorpay-btn"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="btn-spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ marginRight: 8 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Pay ₹{totalAmount} &amp; Place Order
                </>
              )}
            </button>

            <p className="razorpay-secure-note">
              🔒 Payments are processed securely by Razorpay. We never store your card details.
            </p>
          </form>
        </section>

        {/* ── Order summary sidebar ── */}
        <aside className="order-summary">
          <h3>Your Order</h3>
          {cartItems.map((item) => (
            <div className="summary-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>Qty: {item.quantity}</span>
              </div>
              <b>₹{Number(item.price) * item.quantity}</b>
            </div>
          ))}
          <div className="summary-line">
            <span>Subtotal</span>
            <b>₹{subtotal}</b>
          </div>
          <div className="summary-line">
            <span>Delivery Fee</span>
            <b>₹{deliveryFee}</b>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <b>₹{totalAmount}</b>
          </div>

          <div className="razorpay-logo-row">
            <span>Secured by</span>
            <img
              src="https://razorpay.com/assets/razorpay-glyph.svg"
              alt="Razorpay"
              style={{ height: 20, marginLeft: 6 }}
            />
            <strong>Razorpay</strong>
          </div>
        </aside>
      </main>
    </div>
  );
}
