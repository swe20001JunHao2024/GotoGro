// src/components/Star.js
import React from 'react';
import './Star.css'; // Create a CSS file for styles

const Star = ({ filled }) => {
  return (
    <span className={filled ? 'star filled' : 'star'}>
      &#9733; {/* Unicode for filled star */}
    </span>
  );
};

export default Star;
