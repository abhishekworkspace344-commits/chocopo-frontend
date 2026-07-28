import Navbar from "../components/Navbar";
import React from "react";
import { Link } from "react-router-dom";

export default function OurStory() {
  return (
    <div className="story-page">
      <Navbar />

      <section className="story-hero">
        <div className="story-hero-overlay"></div>

        <div className="story-hero-content">
          <p className="menu-kicker">OUR STORY</p>
          <h1>Made from a love for sweet moments.</h1>
          <p>
            CHOCOPO began with one simple idea: every day deserves a little
            happiness.
          </p>
        </div>
      </section>

      <section className="story-intro-section">
        <div className="story-image-card">
          <img
            src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
            alt="Chocolate dessert preparation"
          />
        </div>

        <div className="story-text-content">
          <p className="menu-kicker">THE CHOCOPO JOURNEY</p>
          <h2>A small idea with a big sweet heart.</h2>

          <p>
            CHOCOPO was created for people who love chocolate, warm
            conversations and beautiful little celebrations. We wanted to build
            more than a dessert place — we wanted to create a happy corner
            where every bite feels special.
          </p>

          <p>
            From rich chocolate cakes and brownies to creamy drinks, snacks and
            custom sweet treats, every CHOCOPO product is prepared with care,
            quality ingredients and a lot of love.
          </p>

          <p>
            Whether it is a birthday, a surprise for someone special, a coffee
            break with friends or a quiet moment for yourself, CHOCOPO is here
            to make it sweeter.
          </p>
        </div>
      </section>

      <section className="story-values-section">
        <div className="section-heading">
          <p className="menu-kicker">WHAT WE BELIEVE</p>
          <h2>Our recipe for happiness</h2>
        </div>

        <div className="story-values-grid">
          <article className="story-value-card">
            <span>01</span>
            <h3>Quality First</h3>
            <p>
              We choose ingredients that make every product rich, fresh and
              memorable.
            </p>
          </article>

          <article className="story-value-card">
            <span>02</span>
            <h3>Made Fresh</h3>
            <p>
              We prepare every order with attention so your treats reach you at
              their best.
            </p>
          </article>

          <article className="story-value-card">
            <span>03</span>
            <h3>Sweet Connections</h3>
            <p>
              We believe food brings people together and every celebration
              deserves something delicious.
            </p>
          </article>
        </div>
      </section>

      <section className="story-quote-section">
        <div className="story-quote-box">
          <span>“</span>
          <h2>
            A little chocolate can turn an ordinary day into a beautiful memory.
          </h2>
          <p>— CHOCOPO</p>
        </div>
      </section>

      <section className="story-cta-section">
        <div>
          <p className="menu-kicker">READY FOR SOMETHING SWEET?</p>
          <h2>Explore the CHOCOPO menu.</h2>
          <p>
            Cakes, brownies, beverages, snacks and more — made for your next
            sweet moment.
          </p>
        </div>

        <Link to="/menu" className="pink-main-button">
          Explore Our Products
        </Link>
      </section>

      <footer className="chocopo-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>CHOCOPO™</h2>
            <p>
              Sweet treats, warm moments and lots of chocolate happiness.
            </p>
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
            <a href="mailto:hello@chocopo.com">hello@chocopo.com</a>
            <a href="tel:+919000000000">+91 90000 00000</a>
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