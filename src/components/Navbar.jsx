// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { CartContext } from "../context/Cart";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/Auth";


const Navbar = () => {
  const { query, setQuery } = useContext(SearchContext);
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="navbar">
        {/* Left Section - Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <a>Amazon</a>
          </Link>

          {/* Location Section */}
          <div className="nav-location">
            <div className="nav-location-icon">📍</div>
            <div className="nav-location-text">
              <small>Deliver to</small>
              <strong>India</strong>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search Amazon.in"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>🔍</button>
        </div>

        {/* Right Section - Account & Links */}
        <div className="nav-links">
          {/* Prime Badge */}
          <div className="nav-prime">
            <span>✓ Prime</span>
          </div>

          {/* Account Section */}
          <div className="nav-account-wrapper">
            {user ? (
              <div
                className="nav-account"
                onMouseEnter={() => setShowAccountMenu(true)}
                onMouseLeave={() => setShowAccountMenu(false)}
              >
                <div style={{ fontSize: "1.2rem" }}>👤</div>
                <div className="nav-account-text">
                  <small>Hello,</small>
                  <strong>{user.name || "User"}</strong>
                </div>
                {showAccountMenu && (
                  <div className="account-dropdown">
                    <Link to="/orders">Your Orders</Link>
                    <Link to="/profile">Your Account</Link>
                    <Link to="/wishlist">Your Wishlist</Link>
                    <hr />
                    <a onClick={logout} style={{ cursor: "pointer" }}>
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-account">
                <div style={{ fontSize: "1.2rem" }}>👤</div>
                <div className="nav-account-text">
                  <small>Hello, Sign In</small>
                  <strong>Account</strong>
                </div>
              </Link>
            )}
          </div>

          {/* Returns */}
          <Link to="/orders" className="nav-returns">
            <div style={{ fontSize: "0.9rem" }}>↩️</div>
            <div className="nav-returns-text">
              <small>Returns</small>
              <strong>& Orders</strong>
            </div>
          </Link>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="nav-wishlist">
            <div style={{ fontSize: "1.1rem" }}>❤️</div>
            <div className="nav-wishlist-text">
              <small>Your</small>
              <strong>Wishlist</strong>
            </div>
          </Link>

          {/* Cart Link with Badge */}
          <Link to="/cart" className="cart-link">
            🛒 <span className="cart-count">{count}</span>
          </Link>
        </div>
      </nav>

      {/* Category Bar */}
      <div className="category-bar">
        <Link to="/" className="category-link active">Deals</Link>
        <a href="#" className="category-link">Fresh</a>
        <a href="#" className="category-link">Amazon Basics</a>
        <a href="#" className="category-link">Fashion</a>
        <a href="#" className="category-link">Electronics</a>
        <a href="#" className="category-link">Home & Kitchen</a>
        <a href="#" className="category-link">Sell</a>
      </div>
    </>
  );
};

export default Navbar;
