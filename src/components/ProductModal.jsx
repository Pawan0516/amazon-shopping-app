// src/components/ProductModal.jsx
import React, { useEffect } from "react";
import "../styles/product-modal.css";

const ProductModal = ({ product, onClose, onAdd }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="pm-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pm-card" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close" onClick={onClose}>✕</button>
        <div className="pm-grid">
          <img className="pm-image" src={product.image} alt={product.title} />
          <div className="pm-info">
            <h2>{product.title}</h2>
            <p className="muted">{product.category}</p>
            <p className="pm-desc">{product.description}</p>
            <div className="pm-bottom">
              <div className="price">₹{(product.price*85).toFixed(0)}</div>
              <div>
                <button className="primary" onClick={() => onAdd(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
