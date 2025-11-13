// src/pages/Home.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import "../styles/home.css";
import "../styles/product-modal.css";
import ProductModal from "../components/ProductModal";
import { CartContext } from "../context/Cart";
import { SearchContext } from "../context/SearchContext";
import HeroSlider from "../components/HeroSlider";
import LiquidEffect from "../components/LiquidEffect"; // <- Liquid scroll / paint effect

const Home = ({ wishlist, addToWishlist, removeFromWishlist }) => {
  const [active, setActive] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { query, category, setCategory, price, setPrice } = useContext(SearchContext);
  const [allProducts, setAllProducts] = useState([]);
  const offersRef = useRef(null);
  const gridRef = useRef(null);
  const offers = allProducts.slice(0, 8);

  const scrollOffers = (delta = 300) => {
    if (!offersRef.current) return;
    offersRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  // reveal product cards with stagger when scrolled into view
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll(".p-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const idx = Number(el.dataset.index || 0);
          if (entry.isIntersecting) {
            // stagger using inline transition-delay so index ordering matters
            el.style.transitionDelay = `${idx * 70}ms`;
            el.classList.add("in-view");
          } else {
            el.classList.remove("in-view");
            el.style.transitionDelay = "";
          }
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [allProducts, query, category, price]);

  const products = allProducts.filter((p) => {
    const inCategory = category === "all" || p.category === category;
    const inQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const inPrice = p.price * 85 >= price[0] && p.price * 85 <= price[1];
    return inCategory && inQuery && inPrice;
  });

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => r.json())
      .then(setAllProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
        setAllProducts([]);
      });
  }, []);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.find((item) => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // deterministic-looking pseudo-random rating (based on product id)
  const getRandomRating = (productId) => {
    const rand = Math.sin(productId) * 10000;
    return (Math.floor((rand - Math.floor(rand)) * 50) / 10).toFixed(1);
  };

  const getRandomReviews = (productId) => {
    const rand = Math.sin(productId * 2) * 10000;
    return Math.floor((rand - Math.floor(rand)) * 5000) + 100;
  };

  return (
    <div className="home-container">
      {/* Liquid effect overlay (captures wheel + mouse position but pointer-events: none so UI remains interactive) */}
      <LiquidEffect baseColor={[32, 150, 255]} />

      <HeroSlider />

      <section className="offers-section">
        <div className="offers-header">
          <h3>New Offers</h3>
          <div className="offers-controls">
            <button className="scroll-btn" onClick={() => scrollOffers(-320)} aria-label="Scroll left">‹</button>
            <button className="scroll-btn" onClick={() => scrollOffers(320)} aria-label="Scroll right">›</button>
          </div>
        </div>

        <div className="offers-scroll" ref={offersRef}>
          {offers.map((p) => (
            <div className="offer-card" key={p.id}>
              <div className="offer-thumb">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="offer-body">
                <div className="offer-title">{p.title.slice(0, 48)}</div>
                <div className="offer-price">
                  ₹{(p.price * 85).toFixed(0)} <span className="old">₹{(p.price * 100).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="deals-banner">
        <h2>⚡ Deals of the Day</h2>
      </div>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {[...new Set(allProducts.map((p) => p.category))].map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <label>
          Price Range: ₹{price[0]} – ₹{price[1]}
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={price[1]}
            onChange={(e) => setPrice([0, Number(e.target.value)])}
          />
        </label>
      </div>

      <div className="grid-products" ref={gridRef}>
        {products.map((p, index) => {
          const rating = getRandomRating(p.id);
          const reviews = getRandomReviews(p.id);
          const isWishlisted = wishlist.some((item) => item.id === p.id);

          return (
            <article className="p-card" key={p.id} data-index={index} aria-labelledby={`p-${p.id}`}>
              <div className="p-card-header">
                <div className="p-thumb" onClick={() => setActive(p)} role="button" tabIndex={0}>
                  <img src={p.image} alt={p.title} />
                </div>
                <button
                  className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
                  onClick={() => toggleWishlist(p)}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
              </div>

              <h3 id={`p-${p.id}`}>{p.title.slice(0, 50)}</h3>

              <div className="p-rating">
                <div className="stars">⭐ {rating}</div>
                <span className="review-count">({reviews} reviews)</span>
              </div>

              <div className="p-price-section">
                <div className="price">₹{(p.price * 85).toFixed(0)}</div>
                <span className="original-price">₹{(p.price * 100).toFixed(0)}</span>
                <span className="discount">-15%</span>
              </div>

              <div className="p-delivery">
                <span>✓ Free Delivery</span>
              </div>

              <div className="p-meta">
                <div className="actions">
                  <button className="ghost" onClick={() => setActive(p)}>Quick View</button>
                  <button className="primary" onClick={() => addToCart(p)}>Add to Cart</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ProductModal
        product={active}
        onClose={() => setActive(null)}
        onAdd={(p) => {
          addToCart(p);
          setActive(null);
        }}
      />
    </div>
  );
};

export default Home;
