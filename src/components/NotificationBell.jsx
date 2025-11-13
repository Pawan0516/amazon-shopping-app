import React, { useState } from "react";
import "../styles/bell.css";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Bell */}
      <div className="bell-container" onClick={() => setOpen(!open)}>
        <div className="bell-icon">
          🔔
        </div>
        <span className="pulse"></span>
      </div>

      {/* Popup Box */}
      {open && (
        <div className="bell-popup">
          <h3>Latest Offers 🎉</h3>
          
          <ul>
            <li>🔥 50% off on Electronics!</li>
            <li>👜 Fashion Sale — Buy 2 Get 1 Free</li>
            <li>📱 New Mobile Launch Offers</li>
            <li>🍳 Home & Kitchen Mega Deals</li>
          </ul>

          <button className="close-btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default NotificationBell;

