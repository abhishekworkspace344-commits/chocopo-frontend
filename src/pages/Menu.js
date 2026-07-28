import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Could not load categories:", error);
      setMessage("Could not load categories. Check whether Flask is running.");
    }
  };

  const loadProducts = async (categoryId = null) => {
    try {
      setLoading(true);

      const url = categoryId
        ? `${API_BASE_URL}/products?category_id=${categoryId}`
        : `${API_BASE_URL}/products`;

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Could not load products:", error);
      setMessage("Could not load menu items. Check whether Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    loadProducts(categoryId);
  };

  const addToCart = (product) => {
    const savedCart = JSON.parse(
      localStorage.getItem("chocopo_cart") || "[]"
    );

    const existingItem = savedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      savedCart.push({
        id: product.id,
        name: product.name,
        price: product.discount_price !== null ? product.discount_price : product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }

    localStorage.setItem("chocopo_cart", JSON.stringify(savedCart));

    setMessage(`${product.name} added to cart.`);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="menu-page">
      <Navbar />

      <main className="menu-container">
        <div className="menu-heading">
          <div>
            <p className="menu-kicker">MENU</p>
            <h2>Choose your favourites</h2>
          </div>

          <Link to="/cart" className="view-cart-button">
            View Cart
          </Link>
        </div>

        {message && <div className="menu-message">{message}</div>}

        <div className="category-tabs">
          <button
            className={!selectedCategoryId ? "active-category" : ""}
            onClick={() => selectCategory(null)}
          >
            All Items
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={
                selectedCategoryId === category.id ? "active-category" : ""
              }
              onClick={() => selectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="menu-loading">Loading CHOCOPO menu...</div>
        ) : products.length === 0 ? (
          <div className="menu-loading">
            No products are available in this category right now.
          </div>
        ) : (
          <div className="menu-grid">
            {products.map((product) => (
              <article className="menu-card" key={product.id} style={{ position: "relative" }}>
                {product.offers && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#ff4d4f", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", zIndex: 1 }}>
                    {product.offers}
                  </div>
                )}
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085";
                  }}
                />

                <div className="menu-card-content">
                  <span>{product.category_name}</span>
                  <h3>{product.name}</h3>
                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-footer">
                    <div>
                      {product.discount_price !== null ? (
                        <h4>
                          <s style={{ color: "#999", fontSize: "0.85em", marginRight: "8px" }}>₹{product.price}</s>
                          ₹{product.discount_price}
                        </h4>
                      ) : (
                        <h4>₹{product.price}</h4>
                      )}
                      <small>
                        Ready in about {product.preparation_minutes} minutes
                      </small>
                    </div>

                    <button onClick={() => addToCart(product)}>
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
