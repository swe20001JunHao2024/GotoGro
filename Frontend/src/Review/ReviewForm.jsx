import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css'; // Import the CSS file
import Nav from '../NavBar/Nav';

const ReviewForm = () => {
  const [rating, setRating] = useState(0); // Rating between 1 and 5
  const [hoverRating, setHoverRating] = useState(0); // Track the hovered rating
  const [review, setReview] = useState(''); // User review text
  const [message, setMessage] = useState(''); // Success/error message
  const [loading, setLoading] = useState(false); // To show a loading state when submitting

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !review) {
      setMessage('Please provide a rating and review.');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    try {
      const token = localStorage.getItem('token'); // Assuming you're storing the JWT token in localStorage
  
      const response = await axios.post(
        '/reviews', // This should match the backend route
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token for authentication
          },
        }
      );
  
      setMessage('Review submitted successfully!');
      setRating(0);
      setReview('');
    } catch (error) {
      // Error handling
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while submitting the review.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Nav/>
    <div className="review-form-container">
      <h2>Share your experience</h2>
      <form onSubmit={handleSubmit}>
        <label>How would you rate us?</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={hoverRating >= star || rating >= star ? 'gold' : 'gray'}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)} // Set the hover rating
              onMouseLeave={() => setHoverRating(0)}   // Reset hover rating when mouse leaves
            >
              ★
            </span>
          ))}
        </div>
        
        <label htmlFor="review">Review</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          placeholder="Write your review here..."
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default ReviewForm;
