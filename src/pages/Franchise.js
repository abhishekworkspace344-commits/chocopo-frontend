import axios from "axios";
import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function Franchise() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    investment: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.city ||
      !form.investment
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitted(false);

      await axios.post(API_BASE_URL + "/franchise-enquiries", {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        investment: form.investment,
        message: form.message
      });

      setSubmitted(true);

      setForm({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        investment: "",
        message: ""
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="franchise-page">
      <Navbar />

      <section className="franchise-hero">
        <div className="franchise-hero-overlay"></div>

        <div className="franchise-hero-content">
          <p className="menu-kicker">GROW WITH CHOCOPO</p>
          <h1>Bring sweeter moments to your city.</h1>
          <p>
            Join the CHOCOPO family and build a joyful cafe and dessert
            experience in your community.
          </p>

          <a href="#franchise-form" className="pink-main-button">
            Apply for Franchise
          </a>
        </div>
      </section>

      <section className="franchise-intro-section">
        <div className="franchise-intro-image">
          <img
            src="https://images.unsplash.com/photo-1559628233-6b11b4c1e7a6?auto=format&fit=crop&w=1000&q=85"
            alt="CHOCOPO franchise cafe"
          />
        </div>

        <div className="franchise-intro-content">
          <p className="menu-kicker">PARTNER WITH US</p>
          <h2>A sweet business opportunity.</h2>

          <p>
            CHOCOPO is built around products people love: chocolates, cakes,
            brownies, beverages, snacks and celebration treats. Our goal is to
            create welcoming stores where customers can relax, celebrate and
            enjoy something delicious.
          </p>

          <p>
            As a franchise partner, you can bring the CHOCOPO experience to
            your location while receiving support for branding, menu planning,
            store setup and operations.
          </p>
        </div>
      </section>

      <section className="franchise-benefits-section">
        <div className="section-heading">
          <p className="menu-kicker">WHY PARTNER WITH US</p>
          <h2>Everything you need to start sweet.</h2>
        </div>

        <div className="franchise-benefits-grid">
          <article className="franchise-benefit-card">
            <div className="franchise-benefit-icon">🎨</div>
            <h3>Strong Brand Identity</h3>
            <p>
              A modern white-and-pink CHOCOPO brand designed to stand out and
              feel welcoming.
            </p>
          </article>

          <article className="franchise-benefit-card">
            <div className="franchise-benefit-icon">🍫</div>
            <h3>Popular Products</h3>
            <p>
              Cakes, chocolates, beverages, desserts and snacks for everyday
              cravings and celebrations.
            </p>
          </article>

          <article className="franchise-benefit-card">
            <div className="franchise-benefit-icon">📋</div>
            <h3>Setup Support</h3>
            <p>
              Guidance for store design, menu setup, operations and customer
              experience.
            </p>
          </article>

          <article className="franchise-benefit-card">
            <div className="franchise-benefit-icon">📣</div>
            <h3>Marketing Support</h3>
            <p>
              Digital promotions, seasonal offers and branded campaigns to help
              grow your local customer base.
            </p>
          </article>
        </div>
      </section>

      <section className="franchise-process-section">
        <div className="section-heading">
          <p className="menu-kicker">HOW IT WORKS</p>
          <h2>Your CHOCOPO journey in four steps</h2>
        </div>

        <div className="franchise-process-grid">
          <article className="franchise-step-card">
            <span>01</span>
            <h3>Send Enquiry</h3>
            <p>Share your details and preferred city through the form below.</p>
          </article>

          <article className="franchise-step-card">
            <span>02</span>
            <h3>Talk With Us</h3>
            <p>Our team will contact you to understand your interest and plan.</p>
          </article>

          <article className="franchise-step-card">
            <span>03</span>
            <h3>Choose Location</h3>
            <p>Identify a suitable location and finalise the franchise plan.</p>
          </article>

          <article className="franchise-step-card">
            <span>04</span>
            <h3>Open Your Store</h3>
            <p>Set up your CHOCOPO store and welcome your first customers.</p>
          </article>
        </div>
      </section>

      <section className="franchise-form-section" id="franchise-form">
        <div className="franchise-form-info">
          <p className="menu-kicker">FRANCHISE ENQUIRY</p>
          <h2>Tell us about your plan.</h2>
          <p>
            Fill in the form and our CHOCOPO team will contact you about the
            next steps.
          </p>

          <div className="franchise-contact-points">
            <div>
              <span>📍</span>
              <p>
                <strong>Locations</strong>
                Kerala, India and expanding to more cities.
              </p>
            </div>

            <div>
              <span>📞</span>
              <p>
                <strong>Call Us</strong>
                +91  8606923603
              </p>
            </div>

            <div>
              <span>✉️</span>
              <p>
                <strong>Email Us</strong>
                franchise.chocopo@gmail.com
              </p>
            </div>
          </div>
        </div>

        <form className="franchise-form-card" onSubmit={submitForm}>
          {submitted && (
            <div className="franchise-success-message">
              Thank you! Your franchise enquiry has been received. Our team
              will contact you soon.
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={updateForm}
                placeholder="Enter your full name"
                required
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
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Preferred City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={updateForm}
                placeholder="Example: Kochi"
                required
              />
            </div>

            <div className="form-group">
              <label>Investment Range *</label>
              <select
                name="investment"
                value={form.investment}
                onChange={updateForm}
                required
              >
                <option value="">Select range</option>
                <option value="5-10 lakh">₹5 – ₹10 Lakh</option>
                <option value="10-20 lakh">₹10 – ₹20 Lakh</option>
                <option value="20-35 lakh">₹20 – ₹35 Lakh</option>
                <option value="35 lakh plus">₹35 Lakh+</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tell Us More</label>
            <textarea
              name="message"
              value={form.message}
              onChange={updateForm}
              rows="4"
              placeholder="Tell us about your business experience, location idea or questions."
            />
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={submitting}
          >
            {submitting ? "Sending Enquiry..." : "Send Franchise Enquiry"}
          </button>
        </form>
      </section>

      <footer className="chocopo-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>CHOCOPO™</h2>
            <p>Sweet treats, warm moments and lots of chocolate happiness.</p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/our-story">Our Story</Link>
            <Link to="/menu">Our Products</Link>
            <Link to="/our-nature">Our Nature</Link>
            <Link to="/franchise">Franchise</Link>
          </div>

          <div className="footer-column">
            <h4>Order</h4>
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="footer-column">
            <h4>Visit Us</h4>
            <Link to="/store-locator">Store Locator</Link>
            <a href="mailto:franchise.chocopo@gmail.com">franchise.chocopo@gmail.com</a>
            <a href="tel:+91 8606923603">+91  8606923603</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CHOCOPO. All rights reserved.</span>
          <span>Made with chocolate and love.</span>
        </div>
      </footer>
    </div>
  );
}
