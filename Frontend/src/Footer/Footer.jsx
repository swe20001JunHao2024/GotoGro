import React from 'react';
import './Footer.css'; // Assuming you'll style it with a separate CSS file
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li><a href="/about">Our Story</a></li>
              <li><a href="/team">Team</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Customer Service</h3>
            <ul>
              <li><a href="/support">Contact Us</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/cookies">Cookies Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 GotoGro. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
