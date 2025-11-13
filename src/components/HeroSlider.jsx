import React, { useEffect, useState } from "react";
import "../styles/hero.css";

const slides = [
  "https://d2gt4h1eeousrn.cloudfront.net/64399620/cover-JAb5LK/7lf8ndA-1200x1200.jpg",
  "https://t4.ftcdn.net/jpg/14/85/36/19/360_F_1485361900_SQTK2ECfGlwgLMmO9mIw8X1J4iUMIlLv.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-contemporary-black-kitchen-decor-with-stylish-furnishings-and-appliances-visualized-in-image_3779437.jpg",
  "https://plus.unsplash.com/premium_photo-1729436833449-225649403fc0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hcnQlMjBkZXZpY2VzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
  "https://static.vecteezy.com/system/resources/thumbnails/040/150/459/small/stylish-scandinavian-living-room-with-design-mint-sofa-furnitures-mock-up-poster-map-plants-and-elegant-personal-accessories-modern-home-decor-bright-and-sunny-room-generative-ai-illustration-photo.jpg"
];


const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero">
      {slides.map((s, i) => (
        <img key={i} src={s} alt="" className={`slide ${i===index?"active":""}`} />
      ))}
      <div className="overlay-text">
        <h1>Great Deals Today</h1>
        <p>Explore trending offers and fresh arrivals</p>
      </div>
    </div>
  );
};
export default HeroSlider;
