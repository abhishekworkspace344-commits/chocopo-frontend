import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminFranchiseEnquiries from "./pages/AdminFranchiseEnquiries";
import AdminSupportMessages from "./pages/AdminSupportMessages";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OurStory from "./pages/OurStory";
import OurNature from "./pages/OurNature";
import Franchise from "./pages/Franchise";
import StoreLocator from "./pages/StoreLocator";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import ParentCompany from "./pages/ParentCompany";
import AdminCategories from "./pages/AdminCategories";
import BridalMakeup from "./pages/BridalMakeup";
import SupportChat from "./components/SupportChat";

import "./App.css";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-glow splash-glow-one" />
      <div className="splash-glow splash-glow-two" />

      <div className="splash-logo-wrap">
        <div className="splash-chocolate-drop">●</div>
        <h1 className="splash-logo">CHOCOPO™</h1>
        <p>Made for your sweetest moments</p>

        <div className="splash-loader">
          <span />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/our-nature" element={<OurNature />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/parent-company" element={<ParentCompany />} />
        <Route path="/bridal-makeup" element={<BridalMakeup />} />
        <Route path="/store-locator" element={<StoreLocator />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route
          path="/admin/franchise-enquiries"
          element={<AdminFranchiseEnquiries />}
        />
        <Route path="/admin/support-messages" element={<AdminSupportMessages />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Routes>

      <SupportChat />
    </BrowserRouter>
  );
}

export default App;

