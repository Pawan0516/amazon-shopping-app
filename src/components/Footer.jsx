import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer Top - Back to Top */}
      <div className="footer-top">
        <a href="#" className="back-to-top">Back to Top</a>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-section">
          <h4>Get to Know Us</h4>
          <a href="#">About Amazon</a>
          <a href="#">Careers</a>
          <a href="#">Press Releases</a>
          <a href="#">Amazon Blog</a>
          <a href="#">Amazon Cares</a>
        </div>

        <div className="footer-section">
          <h4>Connect with Us</h4>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">YouTube</a>
        </div>

        <div className="footer-section">
          <h4>Make Money with Us</h4>
          <a href="#">Sell on Amazon</a>
          <a href="#">Sell under Amazon Accelerator</a>
          <a href="#">Advertise Your Products</a>
          <a href="#">Amazon Global Selling</a>
          <a href="#">Become an Affiliate</a>
        </div>

        <div className="footer-section">
          <h4>Amazon Business</h4>
          <a href="#">Amazon Business</a>
          <a href="#">Shop B2B Products</a>
          <a href="#">Bulk Ordering</a>
          <a href="#">Business Analytics</a>
          <a href="#">Business Prime</a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-logo">
          <Link to="/">Amazon </Link>
        </div>
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Cookies Notice</a>
          <a href="#">Your Ads Privacy Choices</a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Amazon By Pawan. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
