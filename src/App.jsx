// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Toast from "./components/Toast";
import { SearchProvider } from "./context/SearchProvider";  // ✅ named import (correct)
import { CartProvider } from "./context/CartContext";      // ✅ correct
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import NotificationBell from "./components/NotificationBell"; 
// import NotificationContext from "./context/NotificationContext";


const App = () => {
  const [wishlist, setWishlist] = React.useState([]);

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
            <Navbar />
            <Toast />
            <Routes>
              <Route path="/" element={<Home wishlist={wishlist} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} />} />
              <Route path="/product/:id" element={<ProductPage wishlist={wishlist} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} addToWishlist={addToWishlist} />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <NotificationBell />
            <Footer />
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;
