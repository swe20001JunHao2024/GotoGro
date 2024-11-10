import React from 'react';
import JayaGrocer from '../assets/jayagrocer.png';
import Julies from '../assets/Julies.png';
import Maggi from '../assets/maggi.png';
import Nestle from '../assets/Nestle.png';
import pringles from '../assets/pringles.png';
import walmart from '../assets/walmart.png';
import wonda from '../assets/wonda_logo.png';
import './Brands.css'; // Assuming you'll style it in a separate CSS file

const Brands = () => {
  return (
    <div className="brands-container">
      <h2 className="brands-header">Our Trusted Brands</h2> {/* Header moved inside brands-container */}
      
      <div className="logos-wrapper">
        <img src={JayaGrocer} alt="Jaya Grocer" className="brand-logo" />
        <img src={Julies} alt="Julie's" className="brand-logo" />
        <img src={Maggi} alt="Maggi" className="brand-logo" />
        <img src={Nestle} alt="Nestle" className="brand-logo" />
        <img src={pringles} alt="Pringles" className="brand-logo" />
        <img src={walmart} alt="Walmart" className="brand-logo" />
        <img src={wonda} alt="Wonda" className="brand-logo" />
      </div>
    </div>
  );
}

export default Brands;
