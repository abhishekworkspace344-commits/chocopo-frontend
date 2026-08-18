import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function BridalMakeup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    servicesRequired: "",
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

    if (!form.fullName || !form.phone || !form.eventDate || !form.location) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    // Mock API call delay
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        eventDate: "",
        location: "",
        servicesRequired: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="franchise-page">
      <Navbar />

      <section className="franchise-hero" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/img/hot-chocolate.jpg')" }}>
        <div className="franchise-hero-overlay"></div>
        <div className="franchise-hero-content">
          <p className="menu-kicker">LOOK STUNNING</p>
          <h1>Bridal Makeup Booking</h1>
          <p>
            Book our professional makeup artists for your special day and look absolutely radiant.
          </p>
          <a href="#booking-form" className="pink-main-button">
            Book Now
          </a>
        </div>
      </section>

      <section className="franchise-form-section" id="booking-form">
        <div className="franchise-form-info">
          <p className="menu-kicker">BOOKING ENQUIRY</p>
          <h2>Reserve your date.</h2>
          <p>
            Fill in the form to check availability and get a quote for your bridal makeup needs.
          </p>
        </div>

        <form className="franchise-form-card" onSubmit={submitForm}>
          {submitted && (
            <div className="franchise-success-message">
              Thank you! Your booking enquiry has been received. Our team will contact you soon to confirm availability.
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
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Event Date *</label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={updateForm}
                required
              />
            </div>
            <div className="form-group">
              <label>Event Location / City *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={updateForm}
                placeholder="Example: Kochi"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Services Required</label>
            <select
              name="servicesRequired"
              value={form.servicesRequired}
              onChange={updateForm}
            >
              <option value="">Select service</option>
              <option value="Bridal Makeup Only">Bridal Makeup Only</option>
              <option value="Bridal + Bridesmaids">Bridal + Bridesmaids</option>
              <option value="Pre-Wedding / Engagement">Pre-Wedding / Engagement</option>
              <option value="Full Package (All Events)">Full Package (All Events)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Details</label>
            <textarea
              name="message"
              value={form.message}
              onChange={updateForm}
              rows="4"
              placeholder="Tell us more about your events, themes, or specific requirements."
            />
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={submitting}
          >
            {submitting ? "Sending Enquiry..." : "Send Booking Enquiry"}
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
            <Link to="/bridal-makeup">Bridal Makeup</Link>
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
            <a href="mailto: chocopo.info@gmail.com"> chocopo.info@gmail.com</a>
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
