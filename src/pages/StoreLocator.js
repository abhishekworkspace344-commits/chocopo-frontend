import Navbar from "../components/Navbar";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const stores = [
  {
    id: 1,
    name: "CHOCOPO Trivandrum",
    city: "Thiruvananthapuram",
    address: "MG Road, Thiruvananthapuram, Kerala",
    phone: "+91 90000 00001",
    hours: "10:00 AM – 10:00 PM",
    image:
      "/img/hot-chocolate.jpg"
  },
  {
    id: 2,
    name: "CHOCOPO Kochi",
    city: "Kochi",
    address: "Panampilly Nagar, Kochi, Kerala",
    phone: "+91 90000 00002",
    hours: "10:00 AM – 10:00 PM",
    image:
      "/img/hot-chocolate.jpg"
  },
  {
    id: 3,
    name: "CHOCOPO Kozhikode",
    city: "Kozhikode",
    address: "Hilite Mall Area, Kozhikode, Kerala",
    phone: "+91 90000 00003",
    hours: "10:00 AM – 10:00 PM",
    image:
      "/img/hot-chocolate.jpg"
  },
  {
    id: 4,
    name: "CHOCOPO Malappuram",
    city: "Malappuram",
    address: "Kottakkal Road, Malappuram, Kerala",
    phone: "+91 90000 00004",
    hours: "10:00 AM – 10:00 PM",
    image:
      "/img/hot-chocolate.jpg"
  }
];

export default function StoreLocator() {
  const [searchText, setSearchText] = useState("");

  const filteredStores = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return stores;
    }

    return stores.filter((store) =>
      `${store.name} ${store.city} ${store.address}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchText]);

  return (
    <div className="store-locator-page">
      <Navbar />

      <section className="store-hero">
        <div className="store-hero-overlay"></div>

        <div className="store-hero-content">
          <p className="menu-kicker">STORE LOCATOR</p>
          <h1>Find your nearest CHOCOPO.</h1>
          <p>
            Visit us for cakes, chocolates, drinks, desserts and your favourite
            sweet moments.
          </p>
        </div>
      </section>

      <section className="store-search-section">
        <div className="store-search-heading">
          <p className="menu-kicker">COME SAY HELLO</p>
          <h2>Find a store near you</h2>
          <p>Search by city, area or store name.</p>
        </div>

        <div className="store-search-box">
          <span>⌕</span>
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search city or location..."
          />
        </div>
      </section>

      <section className="store-list-section">
        <div className="store-list-top">
          <h2>
            {filteredStores.length}{" "}
            {filteredStores.length === 1 ? "Store Found" : "Stores Found"}
          </h2>

          <p>
            CHOCOPO is growing. More sweet locations are coming soon.
          </p>
        </div>

        <div className="store-grid">
          {filteredStores.map((store) => (
            <article className="store-card" key={store.id}>
              <img src={store.image || '/img/hot-chocolate.jpg'} onError={(e) => { e.target.onerror = null; e.target.src = '/img/hot-chocolate.jpg'; }} alt={store.name} />

              <div className="store-card-content">
                <span className="store-city-badge">{store.city}</span>
                <h3>{store.name}</h3>

                <div className="store-detail">
                  <span>📍</span>
                  <p>{store.address}</p>
                </div>

                <div className="store-detail">
                  <span>🕒</span>
                  <p>{store.hours}</p>
                </div>

                <div className="store-detail">
                  <span>📞</span>
                  <a href={`tel:${store.phone.replace(/\s/g, "")}`}>
                    {store.phone}
                  </a>
                </div>

                <a
                  className="store-direction-button"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    store.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions →
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="no-store-result">
            <div>🍫</div>
            <h3>No CHOCOPO store found</h3>
            <p>
              Try searching another city, or contact us to bring CHOCOPO to
              your location.
            </p>
            <Link to="/franchise" className="pink-main-button">
              Franchise With Us
            </Link>
          </div>
        )}
      </section>

      <section className="store-map-section">
        <div className="store-map-content">
          <p className="menu-kicker">MORE LOCATIONS COMING SOON</p>
          <h2>Want CHOCOPO in your city?</h2>
          <p>
            We are expanding across Kerala and beyond. Become a franchise
            partner and help us create more sweet moments.
          </p>

          <Link to="/franchise" className="pink-main-button">
            Enquire About Franchise
          </Link>
        </div>

        <div className="store-map-visual">
          <div className="map-dot map-dot-one">📍</div>
          <div className="map-dot map-dot-two">📍</div>
          <div className="map-dot map-dot-three">📍</div>
          <div className="map-dot map-dot-four">📍</div>
          <span>KERALA</span>
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