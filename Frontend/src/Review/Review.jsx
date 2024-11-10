// src/components/Marquee.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Review.css';
import DefaultProfilePic from '../assets/Default_profpic.jpg';
import Star from './Star'; // Import the Star component

const Marquee = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from the backend
    axios.get('http://localhost:8081/reviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  return (
    <div className="reviews-section">
      <h2>User Reviews</h2>
      <div className="reviews-grid">
        {reviews.slice(0, 3).map((review) => ( // Limit to the first 3 reviews
          <div className="review-card" key={review.review_id}>
            <div className="review-header">
              <img 
                src={review.UserPP || DefaultProfilePic} 
                alt={`${review.Username}'s profile`} 
                className="profile-pic"
              />
              <span>{review.Username}</span>
            </div>
            <div className="review-content">
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} filled={index < review.rating} />
                ))}
              </div>
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
