import { useState } from "react";
import { CartContext } from "./Cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = (inINR = true) => {
    // fakestore prices are in USD — earlier you used *85 for INR
    const raw = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return inINR ? raw * 85 : raw;
  };

  // mock placeOrder: returns an order object and clears cart
  const placeOrder = ({ name, email, address, paymentMethod }) => {
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cartItems,
      totalINR: (getTotal(true)).toFixed(0),
      customer: { name, email, address },
      paymentMethod,
      status: "Confirmed",
    };
    // pretend we sent it to server...
    clearCart();
    return order;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
