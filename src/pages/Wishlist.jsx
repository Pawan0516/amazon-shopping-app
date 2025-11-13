import React, { useContext, useState } from 'react';
import { CartContext } from '../context/Cart';
import '../styles/wishlist.css';

const Wishlist = ({ wishlist, removeFromWishlist }) => {
  const { addToCart } = useContext(CartContext);
  const [filteredWishlist, setFilteredWishlist] = useState(wishlist);

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-icon">❤️</div>
        <h2>Your Wishlist is Empty</h2>
        <p>Add items to your wishlist to keep track of your favorite products</p>
        <a href="/" className="back-btn">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>❤️ My Wishlist</h1>
        <p>{wishlist.length} item(s)</p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(product => (
          <div className="wishlist-item" key={product.id}>
            <div className="item-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="item-details">
              <h3>{product.title.slice(0, 50)}</h3>
              <p className="item-price">₹{(product.price * 85).toFixed(0)}</p>
              <p className="item-desc">{product.description?.slice(0, 80)}...</p>
            </div>
            <div className="item-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => handleMoveToCart(product)}
              >
                Add to Cart
              </button>
              <button 
                className="remove-btn"
                onClick={() => removeFromWishlist(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
