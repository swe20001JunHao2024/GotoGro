import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import './MonthlyNews.css';

const MonthlyNews = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8081/news'); // Update with your API endpoint
        setNewsItems(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className='News-container'>
      <div className='Title'>
        <p>MONTLY </p>
        <p style={{ color: '#377032' }}> NEWS</p>
      </div>

      {/* Carousel Section */}
      <Carousel interval={5000} controls={true} indicators={true}>
        {newsItems.map((newsItem) => (
          <Carousel.Item key={newsItem.news_id}>
            <img
              className="d-block w-100"
              src={newsItem.news_img} // Assuming news_img stores the image filename
              alt={newsItem.news_title} // Use news_title for accessibility
            />
            <Carousel.Caption>
              <h3>{newsItem.news_title}</h3>
              
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default MonthlyNews;
