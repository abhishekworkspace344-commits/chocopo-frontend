import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("chocopo_cart") || "[]"
    );
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("chocopo_cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <p className="menu-kicker">CART</p>
        <h2>Your selections</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/menu" className="order-button">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image || '/img/hot-chocolate.jpg'} onError={(e) => { e.target.onerror = null; e.target.src = '/img/hot-chocolate.jpg'; }} alt={item.name} />

                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>

                <button onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-total">
              <h3>Total: ₹{totalAmount}</h3>
              <Link to="/checkout" className="order-button">
                Schedule Order
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
