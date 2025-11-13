// src/pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import { CartContext } from "../context/Cart";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { AuthContext } from "../context/Auth";

const initialForm = {
  name: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "card",
};

const Checkout = () => {
  const { cartItems, getTotal, placeOrder } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState(null);

  if (!user) {
    return <p style={{ textAlign: "center" }}>Please <a href="/login">login</a> to access your cart.</p>;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^[0-9]{5,6}$/.test(form.pincode)) e.pincode = "Pincode looks wrong";
    return e;
  };

  const onChange = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: null }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const eobj = validate();
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }
    if (cartItems.length === 0) {
      setErrors({ cart: "Your cart is empty. Add something lovely." });
      return;
    }

    setProcessing(true);

    // small visual delay to mimic processing/promise
    setTimeout(() => {
      const orderObj = placeOrder({
        name: form.name,
        email: form.email,
        address: `${form.addressLine1}, ${form.addressLine2}, ${form.city}, ${form.state} - ${form.pincode}`,
        paymentMethod: form.paymentMethod,
      });
      setOrder(orderObj);
      setProcessing(false);
    }, 1000);
  };

  if (order) {
    return (
      <div className="checkout-page">
        <div className="order-card">
          <div className="order-hero">🎉 Order Confirmed</div>
          <h2>Thank you, {order.customer.name}.</h2>
          <p className="muted">Your order <strong>{order.id}</strong> is being prepared.</p>

          <div className="order-summary">
            <div><strong>Total</strong><span>₹{order.totalINR}</span></div>
            <div><strong>Items</strong><span>{order.items.length}</span></div>
            <div><strong>Payment</strong><span>{order.paymentMethod}</span></div>
          </div>

          <p className="poem">Starlight packed, parcel singing — your treasures ride the dusk to doorstep.</p>

          <div className="order-actions">
            <button className="primary" onClick={() => navigate("/")}>Continue Shopping</button>
            <button onClick={() => navigate("/")} className="ghost">Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
        <h1>Checkout</h1>

        <section className="card address-card">
          <h3>Shipping Address</h3>
          <div className="row">
            <label>
              <span>Name</span>
              <input value={form.name} onChange={(e) => onChange("name", e.target.value)} />
              {errors.name && <small className="error">{errors.name}</small>}
            </label>

            <label>
              <span>Email</span>
              <input value={form.email} onChange={(e) => onChange("email", e.target.value)} />
              {errors.email && <small className="error">{errors.email}</small>}
            </label>
          </div>

          <label>
            <span>Address line 1</span>
            <AddressAutocomplete onSelect={(val) => onChange("addressLine1", val)} />
            {errors.addressLine1 && <small className="error">{errors.addressLine1}</small>}
          </label>

          <label>
            <span>Address line 2 (optional)</span>
            <input value={form.addressLine2} onChange={(e) => onChange("addressLine2", e.target.value)} />
          </label>

          <div className="row">
            <label>
              <span>City</span>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} />
              {errors.city && <small className="error">{errors.city}</small>}
            </label>

            <label>
              <span>State</span>
              <input value={form.state} onChange={(e) => onChange("state", e.target.value)} />
            </label>

            <label>
              <span>Pincode</span>
              <input value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} />
              {errors.pincode && <small className="error">{errors.pincode}</small>}
            </label>
          </div>
        </section>

        <section className="card payment-card">
          <h3>Payment</h3>

          <div className="payment-options">
            <label className="radio">
              <input type="radio" name="pay" checked={form.paymentMethod === "card"} onChange={() => onChange("paymentMethod", "card")} />
              <span>Credit/Debit Card</span>
            </label>

            <label className="radio">
              <input type="radio" name="pay" checked={form.paymentMethod === "upi"} onChange={() => onChange("paymentMethod", "upi")} />
              <span>UPI (mock)</span>
            </label>

            <label className="radio">
              <input type="radio" name="pay" checked={form.paymentMethod === "cod"} onChange={() => onChange("paymentMethod", "cod")} />
              <span>Cash on Delivery</span>
            </label>
          </div>

          <div className="totals">
            <div><span>Items</span><strong>{cartItems.length}</strong></div>
            <div><span>Total</span><strong>₹{getTotal(true).toFixed(0)}</strong></div>
          </div>

          {errors.cart && <div className="error">{errors.cart}</div>}
        </section>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={processing}>
            {processing ? "Processing..." : `Place Order • ₹${getTotal(true).toFixed(0)}`}
          </button>
          <button type="button" className="ghost" onClick={() => navigate(-1)}>Back to Cart</button>
        </div>
      </form>

      {/* small sidebar summary for larger screens */}
      <aside className="mini-summary card">
        <h4>Order Summary</h4>
        <div className="items">
          {cartItems.length === 0 ? <p className="muted">No items yet</p> :
            cartItems.map((it) => (
              <div className="mini-item" key={it.id}>
                <img src={it.image} alt={it.title} />
                <div>
                  <div className="title">{it.title.slice(0, 40)}</div>
                  <div className="meta">Qty {it.quantity} • ₹{(it.price * 85 * it.quantity).toFixed(0)}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="mini-total">
          <span>Total</span>
          <strong>₹{getTotal(true).toFixed(0)}</strong>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
