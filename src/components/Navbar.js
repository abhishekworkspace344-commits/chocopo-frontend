import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_data");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar chocopo-navbar">
      <Link to="/" className="brand">
        CHOCOPO™
      </Link>

      <div className="nav-links chocopo-nav-links">
        <Link to="/our-story">Our Story</Link>
        <Link to="/menu">Our Products</Link>
        <Link to="/franchise">Franchise</Link>
        <Link to="/parent-company">Parent Company</Link>
        <Link to="/cart" className="nav-cart-link">
          Cart
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="nav-logout-btn"
              style={{
                background: "none",
                border: "none",
                color: "var(--rose-deep)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "30px",
                fontFamily: "inherit"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
