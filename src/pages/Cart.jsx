import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cart";
import "../styles/cart.css";
import { AuthContext } from "../context/Auth";


const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity * 85, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (!user) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Please <Link to="/login">login</Link> to access your cart.</div>;
  }

  return (
    <div className="cart-page">
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your Amazon Cart is empty</h2>
          <p>Continue shopping on the Amazon Store</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <h1>Shopping Cart</h1>
            <div className="cart-select-all">
              <input type="checkbox" id="select-all" />
              <label htmlFor="select-all">Select All</label>
            </div>

            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <input type="checkbox" defaultChecked />
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title.slice(0, 60)}</h4>
                  <div className="item-info">
                    <span className="in-stock">In Stock</span>
                    <span className="gift-wrap">Gift wrap available</span>
                  </div>
                  <div className="item-price">₹{(item.price * 85).toFixed(0)}</div>
                </div>
                <div className="item-quantity">
                  <button>-</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                </div>
                <div className="item-total">
                  ₹{(item.price * 85 * item.quantity).toFixed(0)}
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  🗑️ Delete
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <button onClick={clearCart} className="clear-btn">Clear Cart</button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
              
              <div className="promo-code">
                <input type="text" placeholder="Enter promo code" />
                <button>Apply</button>
              </div>
            </div>

            <div className="guarantees">
              <div className="guarantee-item">
                <span>✓</span>
                <p>Free returns</p>
              </div>
              <div className="guarantee-item">
                <span>✓</span>
                <p>Fast & secure shipping</p>
              </div>
              <div className="guarantee-item">
                <span>✓</span>
                <p>Money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
