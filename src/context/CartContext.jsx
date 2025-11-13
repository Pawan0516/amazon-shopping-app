// src/context/CartContext.jsx
import React, { useState, useEffect } from "react";
import { CartContext } from "./Cart";

const ORDERS_KEY = "amazon_clone_orders_v1";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // load persisted orders
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch (err) {
      console.warn("Could not parse orders from localStorage", err);
    }
  }, []);

  // persist orders whenever they change
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, qty) => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCartItems([]);

  const getTotal = (inINR = true) => {
    const raw = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return inINR ? raw * 85 : raw;
  };

  // save order to state + localStorage, then clear cart
  const placeOrder = ({ name, email, address, paymentMethod }) => {
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      totalINR: (getTotal(true)).toFixed(0),
      customer: { name, email, address },
      paymentMethod,
      status: "Confirmed",
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const saveOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        placeOrder,
        orders,
        saveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
