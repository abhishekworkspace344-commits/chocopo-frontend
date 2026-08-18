import Navbar from "../components/Navbar";
import React from "react";
import { Link } from "react-router-dom";

export default function OurNature() {
  return (
    <div className="nature-page">
      <Navbar />

      <section className="nature-hero">
        <div className="nature-hero-overlay"></div>

        <div className="nature-hero-content">
          <p className="menu-kicker">OUR NATURE</p>
          <h1>Good ingredients. Better moments.</h1>
          <p>
            We believe the sweetest treats begin with care, freshness and
            thoughtful choices.
          </p>
        </div>
      </section>

      <section className="nature-intro-section">
        <div className="nature-intro-content">
          <p className="menu-kicker">THE CHOCOPO WAY</p>
          <h2>Made with care from kitchen to cup.</h2>

          <p>
            At CHOCOPO, we focus on making treats that feel comforting,
            delicious and memorable. We select quality ingredients and prepare
            each product with attention to flavour, freshness and presentation.
          </p>

          <p>
            Our menu is designed for small joys — a warm brownie after a long
            day, a cold coffee with friends, a birthday cake for someone special
            or a quick snack when you need a sweet break.
          </p>

          <Link to="/menu" className="text-link-button">
            Explore Our Products →
          </Link>
        </div>

        <div className="nature-intro-image">
          <img
            src="https://images.unsplash.com/photo-1548907040-4d42c0d19d0a?auto=format&fit=crop&w=1000&q=85"
            alt="Fresh chocolate ingredients"
          />
        </div>
      </section>

      <section className="nature-pillars-section">
        <div className="section-heading">
          <p className="menu-kicker">WHAT MATTERS TO US</p>
          <h2>Small choices with a sweet purpose</h2>
        </div>

        <div className="nature-pillars-grid">
          <article className="nature-pillar-card">
            <div className="nature-pillar-icon">🌱</div>
            <h3>Fresh Ingredients</h3>
            <p>
              We focus on ingredients that help every cake, drink and dessert
              taste rich and freshly prepared.
            </p>
          </article>

          <article className="nature-pillar-card">
            <div className="nature-pillar-icon">🍰</div>
            <h3>Thoughtful Preparation</h3>
            <p>
              Every order is prepared with care so it feels special when it
              reaches you.
            </p>
          </article>

          <article className="nature-pillar-card">
            <div className="nature-pillar-icon">♻️</div>
            <h3>Responsible Growth</h3>
            <p>
              As CHOCOPO grows, we aim to make practical choices that reduce
              waste and support a better future.
            </p>
          </article>

          <article className="nature-pillar-card">
            <div className="nature-pillar-icon">💗</div>
            <h3>Happy Communities</h3>
            <p>
              We want every CHOCOPO store to become a welcoming place for
              people, conversations and celebrations.
            </p>
          </article>
        </div>
      </section>

      <section className="nature-image-banner">
        <div className="nature-image-banner-overlay"></div>

        <div className="nature-image-banner-content">
          <p className="menu-kicker">SWEET MOMENTS, SIMPLY MADE</p>
          <h2>Because every good day deserves a little CHOCOPO.</h2>
          <Link to="/menu" className="pink-main-button">
            Order Your Favourite
          </Link>
        </div>
      </section>

      <section className="nature-promise-section">
        <div className="nature-promise-card">
          <div>
            <p className="menu-kicker">OUR PROMISE</p>
            <h2>Freshness, flavour and happiness in every order.</h2>
          </div>

          <p>
            We will continue creating delicious treats, improving our service
            and building a brand that people can trust for their everyday sweet
            moments.
          </p>
        </div>
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
            <Link to="/franchise">Partner With Us</Link>
            <a href="mailto:  chocopo.info@gmail.com"> chocopo.info@gmail.com</a>
            <a href="tel:+91 8606923603">+91 8606923603</a>
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