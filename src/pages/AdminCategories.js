import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", image_url: "", is_active: true });

  const admin = JSON.parse(localStorage.getItem("admin_data") || "null");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (e) {
      showMsg("Could not load categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type = "info") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: "", image_url: "", is_active: true });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, image_url: cat.image_url || "", is_active: cat.is_active !== false });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/admin/categories/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg("Category updated successfully.", "success");
      } else {
        await axios.post(`${API_BASE_URL}/admin/categories`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg("Category created successfully.", "success");
      }
      setShowForm(false);
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error("Category save error:", err.response?.status, err.response?.data);
      showMsg(err.response?.data?.message || `Error ${err.response?.status}: ${JSON.stringify(err.response?.data) || err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg("Category deleted.", "success");
      loadCategories();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error deleting category.", "error");
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
          <Link to="/admin/categories" style={{ marginRight: 15, color: "var(--rose-dark)", fontWeight: 800 }}>Categories</Link>
          <span className="admin-name">{admin?.full_name || "Admin"}</span>
          <button className="admin-logout-button" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-dashboard-header" style={{ marginBottom: 32 }}>
          <div>
            <p className="menu-kicker">INVENTORY</p>
            <h1>Categories</h1>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>
              Manage product categories — these appear as filters on the menu and in product forms.
            </p>
          </div>
          <button className="place-order-button" onClick={showForm ? () => setShowForm(false) : openAdd}>
            {showForm ? "✕ Cancel" : "+ Add New Category"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="menu-message" style={{
            marginBottom: 24,
            background: msgType === "error" ? "#fff0f0" : msgType === "success" ? "#f0fff4" : undefined,
            color: msgType === "error" ? "#c0392b" : msgType === "success" ? "#27ae60" : undefined,
            borderColor: msgType === "error" ? "#ffcccc" : msgType === "success" ? "#b2dfdb" : undefined
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={{
            background: "#fff",
            border: "1px solid var(--rose-line)",
            borderRadius: 20,
            padding: 32,
            marginBottom: 32,
            boxShadow: "var(--shadow)"
          }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, marginBottom: 24 }}>
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="e.g. Gift Boxes"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Preview */}
              {formData.image_url && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>Image Preview</label>
                  <img
                    src={formData.image_url}
                    alt="preview"
                    style={{ height: 120, width: 200, objectFit: "cover", borderRadius: 12, border: "1px solid var(--rose-line)" }}
                    onError={e => e.target.style.display = "none"}
                  />
                </div>
              )}

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 24, fontWeight: 600 }}>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange}
                  style={{ width: "auto", accentColor: "var(--rose-deep)" }} />
                Active (visible on menu page)
              </label>

              <button type="submit" className="place-order-button">
                {editingId ? "Save Changes" : "Create Category"}
              </button>
            </form>
          </div>
        )}

        {/* Category Grid */}
        {loading ? (
          <div className="menu-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty-orders">No categories yet. Add one above.</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20
          }}>
            {categories.map(cat => (
              <div key={cat.id} style={{
                background: "#fff",
                border: "1px solid var(--rose-line)",
                borderRadius: 20,
                overflow: "hidden",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
                boxShadow: "0 2px 12px rgba(169,99,125,0.06)"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(169,99,125,0.06)"; }}
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name}
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: 160, background: "var(--blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                    🍫
                  </div>
                )}
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--ink)" }}>
                      {cat.name}
                    </h3>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                      background: cat.is_active !== false ? "var(--blush)" : "#f0f0f0",
                      color: cat.is_active !== false ? "var(--rose-dark)" : "#999"
                    }}>
                      {cat.is_active !== false ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                    ID #{cat.id} &nbsp;·&nbsp; {cat.product_count ?? 0} product{cat.product_count !== 1 ? "s" : ""}
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => openEdit(cat)} style={{
                      flex: 1, padding: "9px 0", border: "1px solid var(--rose-line)", borderRadius: 999,
                      background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--ink)"
                    }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat.id)} style={{
                      flex: 1, padding: "9px 0", border: "1px solid #ffcccc", borderRadius: 999,
                      background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#c0392b"
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
