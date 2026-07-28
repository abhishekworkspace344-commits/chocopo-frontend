import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    discount_price: "",
    offers: "",
    image_url: "",
    preparation_minutes: 15,
    is_available: true,
    is_featured: false
  });

  const admin = JSON.parse(localStorage.getItem("admin_data") || "null");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadCategories();
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      setMessage("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      description: product.description || "",
      price: product.price,
      discount_price: product.discount_price || "",
      offers: product.offers || "",
      image_url: product.image_url || "",
      preparation_minutes: product.preparation_minutes,
      is_available: product.is_available,
      is_featured: product.is_featured
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Product deleted.");
      loadProducts();
    } catch (error) {
      setMessage("Error deleting product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.discount_price) delete payload.discount_price;
      if (!payload.offers) delete payload.offers;
      
      if (editingId) {
        await axios.put(`${API_BASE_URL}/admin/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Product updated.");
      } else {
        await axios.post(`${API_BASE_URL}/admin/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Product created.");
      }
      
      setShowForm(false);
      setEditingId(null);
      loadProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving product.");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-page">
      <nav className="navbar">
        <Link to="/" className="brand">CHOCOPO™ ADMIN</Link>
        <div className="nav-links">
          <Link to="/admin/dashboard" style={{ marginRight: 15 }}>Orders</Link>
          <Link to="/admin/products" style={{ marginRight: 15 }}>Products</Link>
          <Link to="/admin/categories" style={{ marginRight: 15 }}>Categories</Link>
          <span className="admin-name">{admin?.full_name || "Admin"}</span>
          <button className="admin-logout-button" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div>
            <p className="menu-kicker">INVENTORY</p>
            <h1>Products</h1>
          </div>
          <button className="place-order-button" onClick={() => {
            setEditingId(null);
            setFormData({
              name: "", category_id: categories[0]?.id || "", description: "", price: "", discount_price: "", offers: "", image_url: "", preparation_minutes: 15, is_available: true, is_featured: false
            });
            setShowForm(!showForm);
          }}>
            {showForm ? "Cancel" : "Add New Product"}
          </button>
        </div>

        {message && <div className="menu-message">{message}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
              <div className="form-group">
                <label>Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select required name="category_id" value={formData.category_id} onChange={handleInputChange}>
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Discount Price (₹)</label>
                <input type="number" step="0.01" name="discount_price" value={formData.discount_price} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Offers / Badge Text</label>
                <input type="text" name="offers" value={formData.offers} onChange={handleInputChange} placeholder="e.g. 20% OFF" />
              </div>
              <div className="form-group">
                <label>Preparation Time (mins)</label>
                <input type="number" name="preparation_minutes" value={formData.preparation_minutes} onChange={handleInputChange} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
              <label>
                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} /> Available
              </label>
              <label>
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} /> Featured
              </label>
            </div>
            <button type="submit" className="place-order-button" style={{ marginTop: "20px" }}>Save Product</button>
          </form>
        )}

        {loading ? <div className="menu-loading">Loading products...</div> : (
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0", background: "#fafafa" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Image</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Category</th>
                <th style={{ padding: "12px" }}>Price</th>
                <th style={{ padding: "12px" }}>Discount</th>
                <th style={{ padding: "12px" }}>Offers</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px" }}>{product.id}</td>
                  <td style={{ padding: "12px" }}>
                    <img src={product.image_url} alt={product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  </td>
                  <td style={{ padding: "12px" }}>{product.name}</td>
                  <td style={{ padding: "12px" }}>{product.category_name}</td>
                  <td style={{ padding: "12px" }}>₹{product.price}</td>
                  <td style={{ padding: "12px" }}>{product.discount_price ? `₹${product.discount_price}` : "-"}</td>
                  <td style={{ padding: "12px" }}>{product.offers || "-"}</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => handleEdit(product)} style={{ marginRight: "10px", padding: "4px 8px", cursor: "pointer", background: "#1890ff", color: "white", border: "none", borderRadius: "4px" }}>Edit</button>
                    <button onClick={() => handleDelete(product.id)} style={{ padding: "4px 8px", cursor: "pointer", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
