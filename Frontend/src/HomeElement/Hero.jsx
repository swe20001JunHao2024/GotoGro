import React from 'react';
import './Hero.css';
import yourImage from '../assets/Hero.png';
import Shop from '../assets/3DShop.png';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Hero = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook

  // Function to navigate to the product page
  const goToProductPage = () => {
    navigate('/product');  // Navigate to the product page
  };

  return (
    <div className='Hero-container'>
      <div className='header'>
        <div className='Hero-text'>
          <p>GOTO</p>
          <p style={{ color: '#377032' }}>GRO</p>
        </div>
      </div>
      <div className='Welcome-text'>
        <p>Welcome to GotoGro MRMS! We're here to make your grocery shopping easier and more convenient. Explore our wide range of products and enjoy a seamless shopping experience!</p>
        {/* Navigate to product page on click */}
        <button className='cta' onClick={goToProductPage}>
          SHOP NOW !
        </button>
      </div>
      <div className='center-image'>
        <img src={yourImage} alt="Center" />
        <div className='shop'>
          <img src={Shop} alt='shop' />
        </div>
      </div>
    </div>
  );
};

export default Hero;
