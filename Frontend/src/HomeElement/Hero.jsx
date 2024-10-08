import React from 'react';
import './Hero.css';
import yourImage from '../assets/Hero.png';
import Shop from '../assets/3DShop.png'


const Hero = () => {
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
        <button>Explore More</button>
      </div>
      <div className='center-image'>
        <img src={yourImage} alt="Center" />
        <div className='shop'>
            <img src={Shop} alt='shop' />
        </div>
      </div>
    </div>
  );
}

export default Hero;
