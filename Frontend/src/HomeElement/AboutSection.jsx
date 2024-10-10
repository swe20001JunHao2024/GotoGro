import React from 'react'
import './AboutSection.css'
import ShopImage from '../assets/Delivery.png';

const AboutSection = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-image">
        <img src={ShopImage} alt="Shop" />
      </div>
      <div className="about-us-text">
        <h2>About Us</h2>
        <p>
          Welcome to GotoGro MRMS, your trusted online grocery platform. We are committed to making your shopping experience seamless and convenient. Our mission is to provide fresh and quality products directly to your doorstep. With a wide range of products available, we aim to meet all your grocery needs in one place.
        </p>
      </div>
    </div>
  )
}

export default AboutSection
