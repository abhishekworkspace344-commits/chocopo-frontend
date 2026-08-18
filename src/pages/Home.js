import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories`),
          axios.get(`${API_BASE_URL}/products`)
        ]);

        setCategories(categoryResponse.data.slice(0, 4));

        const featured = productResponse.data.filter(
          (product) => product.is_featured
        );

        setFeaturedProducts(
          featured.length > 0
            ? featured.slice(0, 4)
            : productResponse.data.slice(0, 4)
        );
      } catch (error) {
        console.error("Could not load CHOCOPO home data:", error);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <section className="chocopo-hero">
        <div className="hero-overlay"></div>

        <div className="chocopo-hero-content">
          <p className="hero-small-title">CHOCOPO · MADE WITH LOVE</p>

          <h1>
            A little happiness
            <span> in every bite.</span>
          </h1>

          <p className="hero-description">
            Handcrafted chocolates, cakes, drinks and sweet little moments
            made fresh for you.
          </p>

          <div className="hero-buttons">
            <Link to="/menu" className="pink-main-button">
              Explore Our Menu
            </Link>

            <Link to="/our-story" className="white-outline-button">
              Discover Our Story
            </Link>
          </div>
        </div>

        <div className="hero-sweet-card">
          <span>Freshly made</span>
          <strong>Sweet. Soft. Special.</strong>
          <p>Every CHOCOPO treat is made to make your day better.</p>
        </div>
      </section>

      <section className="home-intro-section">
        <div className="home-intro-image">
          <img
            src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
            alt="CHOCOPO chocolate dessert"
          />
        </div>

        <div className="home-intro-content">
          <p className="menu-kicker">WELCOME TO CHOCOPO</p>
          <h2>Made for your sweetest moments.</h2>

          <p>
            CHOCOPO is a happy place for chocolate lovers. From rich cakes and
            warm brownies to chilled drinks and delicious snacks, every item is
            made with care, flavour and a little extra joy.
          </p>

          <p>
            Whether you are celebrating, meeting friends or simply treating
            yourself, there is always something sweet waiting for you.
          </p>

          <Link to="/our-story" className="text-link-button">
            Read Our Story →
          </Link>
        </div>
      </section>

      <section className="speciality-section">
        <div className="section-heading">
          <p className="menu-kicker">WHY CHOCOPO</p>
          <h2>Our little specialities</h2>
          <p>
            Crafted for comfort, celebrations and chocolate cravings.
          </p>
        </div>

        <div className="speciality-grid">
          <article className="speciality-card">
            <div className="speciality-icon">🍫</div>
            <h3>Rich Chocolate</h3>
            <p>
              Premium chocolate flavours in every bite, sip and dessert.
            </p>
          </article>

          <article className="speciality-card">
            <div className="speciality-icon">🎂</div>
            <h3>Freshly Prepared</h3>
            <p>
              Cakes, brownies and drinks made fresh for your order.
            </p>
          </article>

          <article className="speciality-card">
            <div className="speciality-icon">💗</div>
            <h3>Made With Love</h3>
            <p>
              Sweet recipes created to make everyday moments feel special.
            </p>
          </article>

          <article className="speciality-card">
            <div className="speciality-icon">🛍️</div>
            <h3>Easy Pre-Order</h3>
            <p>
              Pick your favourites, select a time and collect with ease.
            </p>
          </article>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading category-heading">
          <div>
            <p className="menu-kicker">OUR MENU</p>
            <h2>Find your favourite treat</h2>
          </div>

          <Link to="/menu" className="text-link-button">
            View Full Menu →
          </Link>
        </div>

        <div className="home-category-grid">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                to="/menu"
                className="home-category-card"
                key={category.id}
              >
                <img src={category.image_url} alt={category.name} />
                <div className="category-card-overlay">
                  <h3>{category.name}</h3>
                  <span>Explore now →</span>
                </div>
              </Link>
            ))
          ) : (
            <>
              <Link to="/menu" className="home-category-card">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85"
                  alt="Beverages"
                />
                <div className="category-card-overlay">
                  <h3>Beverages</h3>
                  <span>Explore now →</span>
                </div>
              </Link>

              <Link to="/menu" className="home-category-card">
                <img
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85"
                  alt="Desserts"
                />
                <div className="category-card-overlay">
                  <h3>Desserts</h3>
                  <span>Explore now →</span>
                </div>
              </Link>

              <Link to="/menu" className="home-category-card">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85"
                  alt="Cakes"
                />
                <div className="category-card-overlay">
                  <h3>Cakes</h3>
                  <span>Explore now →</span>
                </div>
              </Link>

              <Link to="/menu" className="home-category-card">
                <img
                  src="https://images.unsplash.com/photo-1621939514649-280e2aa8e570?auto=format&fit=crop&w=800&q=85"
                  alt="Snacks"
                />
                <div className="category-card-overlay">
                  <h3>Snacks</h3>
                  <span>Explore now →</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <p className="menu-kicker">CUSTOMER FAVOURITES</p>
          <h2>Sweet picks for you</h2>
        </div>

        <div className="featured-product-grid">
          {featuredProducts.map((product) => (
            <article className="featured-product-card" key={product.id}>
              <img src={product.image_url} alt={product.name} />

              <div className="featured-product-content">
                <span>{product.category_name}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="featured-product-bottom">
                  <strong>
                    ₹
                    {product.discount_price !== null
                      ? product.discount_price
                      : product.price}
                  </strong>

                  <Link to="/menu">Order Now</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-order-banner">
        <div>
          <p className="menu-kicker">SCHEDULE YOUR ORDER</p>
          <h2>Your CHOCOPO moment is waiting.</h2>
          <p>
            Choose your favourites, select a pickup or delivery time and enjoy
            your treats fresh.
          </p>
        </div>

        <Link to="/menu" className="pink-main-button">
          Start Ordering
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
            <a href="mailto:  chocopo.info@gmail.com"> chocopo.info@gmail.com</a>
            <a href="tel: +91 8606923603"> +918606923603</a>
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
