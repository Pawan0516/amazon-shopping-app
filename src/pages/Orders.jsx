// src/pages/Orders.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/Cart";
import "../styles/orders.css";

const Orders = () => {
  const { orders } = useContext(CartContext);
  const [selected, setSelected] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty card">
          <h3>No orders yet</h3>
          <p>Your order history will appear here after you place something.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-list">
        {orders.map((o) => (
          <article className="order-card" key={o.id} onClick={() => setSelected(o)}>
            <div className="oc-top">
              <div className="oc-id">{o.id}</div>
              <div className="oc-date">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="oc-body">
              <div className="oc-cust">{o.customer.name}</div>
              <div className="oc-meta">{o.items.length} item(s) • ₹{o.totalINR}</div>
            </div>
            <div className="oc-status">{o.status}</div>
          </article>
        ))}
      </div>

      {selected && (
        <aside className="order-detail card">
          <button className="close" onClick={() => setSelected(null)}>✕</button>
          <h3>Order {selected.id}</h3>
          <p className="muted">Placed {new Date(selected.createdAt).toLocaleString()}</p>
          <div className="address"><strong>Ship to</strong><div>{selected.customer.address}</div></div>

          <div className="items">
            {selected.items.map((it) => (
              <div className="item" key={it.id}>
                <img src={it.image} alt={it.title} />
                <div>
                  <div className="title">{it.title}</div>
                  <div className="meta">Qty {it.quantity} • ₹{(it.price*85*it.quantity).toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total</span><strong>₹{selected.totalINR}</strong>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Orders;
