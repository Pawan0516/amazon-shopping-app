import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "../styles/product.css";
import { CartContext } from "../context/Cart";

const ProductPage = ({ wishlist = [], addToWishlist, removeFromWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <p className="loading">Loading...</p>;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="product-page">
      <img src={product.image} alt={product.title} />
      <div className="product-info">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <h3>₹{(product.price * 85).toFixed(0)}</h3>
        <div className="product-actions">
          <button onClick={() => addToCart(product)}>Add to Cart</button>
          <button 
            className={`wishlist-button ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={toggleWishlist}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
