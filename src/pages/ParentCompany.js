import Navbar from "../components/Navbar";
import React from "react";

import "./ParentCompany.css";

export default function ParentCompany() {
  return (
    <div className="parent-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= HERO ================= */}

      <section className="parent-hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-small">
            Proud Parent Company of CHOCOPO
          </span>

          <h1>Nekkallil Gardens</h1>

          <h2>
            Nature • Tradition • Excellence
          </h2>

          <p>
            Growing natural products with passion,
            preserving family traditions,
            and delivering premium homemade foods
            for generations.
          </p>

          <a href="#about" className="hero-button">
            Discover Our Story
          </a>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="about-section" id="about">

        <div className="about-image">

          <img
  src="/img/WhatsApp Image 2026-08-01 at 7.50.58 PM.jpeg"
  alt="Garden"
/>
        </div>

        <div className="about-content">

          <span>ABOUT US</span>

          <h2>
            Rooted in Nature,
            Growing with Tradition
          </h2>

          <p>

            Nekkallil Gardens is a family-owned botanical
            garden dedicated to producing premium-quality,
            natural food products using sustainable farming
            methods and traditional recipes.

          </p>

          <p>

            Every chocolate, spice, and homemade snack
            represents generations of experience,
            quality craftsmanship,
            and a deep respect for nature.

          </p>

          <p>

            Today, CHOCOPO proudly continues this legacy
            by combining innovation with authentic taste.

          </p>

        </div>

      </section>

      {/* ================= TIMELINE ================= */}

      <section className="timeline-section">

        <h2>Our Journey</h2>

        <div className="timeline">

          <div className="timeline-card">
            <div className="timeline-icon">🌱</div>
            <h3>1975</h3>
            <p>Family Botanical Garden Started</p>
          </div>

          <div className="timeline-card">
            <div className="timeline-icon">🌿</div>
            <h3>1995</h3>
            <p>Organic Farming Expansion</p>
          </div>

          <div className="timeline-card">
            <div className="timeline-icon">🌶️</div>
            <h3>2005</h3>
            <p>Homemade Spice Production</p>
          </div>

          <div className="timeline-card">
            <div className="timeline-icon">🍌</div>
            <h3>2015</h3>
            <p>Traditional Banana Chips</p>
          </div>

          <div className="timeline-card">
            <div className="timeline-icon">🍫</div>
            <h3>2024</h3>
            <p>Launch of CHOCOPO</p>
          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="stat-box">

          <h2>50+</h2>

          <p>Years of Experience</p>

        </div>

        <div className="stat-box">

          <h2>20+</h2>

          <p>Natural Products</p>

        </div>

        <div className="stat-box">

          <h2>15K+</h2>

          <p>Happy Customers</p>

        </div>

        <div className="stat-box">

          <h2>100%</h2>

          <p>Natural Ingredients</p>

        </div>

      </section>

    </div>
  );
}