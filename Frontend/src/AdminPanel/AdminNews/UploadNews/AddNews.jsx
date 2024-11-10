import React, { useState } from 'react';
import axios from 'axios';
import './AddNews.css'; // Ensure you style accordingly
import AdminNav from '../../AdminNav'; // Ensure this imports your sidebar/nav component

const AddNews = () => {
  const [formData, setFormData] = useState({
    news_title: '',
    news_des: '',
    news_img: null, // For file uploads
    news_s_date: '',
    news_e_date: ''
  });

  const [imagePreview, setImagePreview] = useState(''); // State for image preview

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] // For handling file upload
      });
      setImagePreview(URL.createObjectURL(files[0])); // Set preview for the selected image
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newsData = new FormData();
    newsData.append('news_title', formData.news_title);
    newsData.append('news_des', formData.news_des);
    newsData.append('news_img', formData.news_img); 
    newsData.append('news_s_date', formData.news_s_date);
    newsData.append('news_e_date', formData.news_e_date);

    try {
      const response = await axios.post('http://localhost:8081/news', newsData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        alert('News added successfully!');
        setFormData({
          news_title: '',
          news_des: '',
          news_img: null,
          news_s_date: '',
          news_e_date: ''
        });
        setImagePreview(''); 
      }
    } catch (error) {
      console.error('There was an error adding the news:', error);
      alert('Failed to add news. Please try again.');
    }
  };

  return (
    <div className="admin-page">
      <AdminNav />

      <div className="dashboard">
        <h2 className="header-title">Add News</h2>
        <form onSubmit={handleSubmit} className="news-form" encType="multipart/form-data">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="news_title"
              value={formData.news_title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="news_des"
              value={formData.news_des}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              name="news_img"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview">
              <h3>Image Preview:</h3>
              <img src={imagePreview} alt="Image Preview" style={{ width: '100%', height: 'auto' }} />
            </div>
          )}
          
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="news_s_date"
              value={formData.news_s_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="news_e_date"
              value={formData.news_e_date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit News</button>
        </form>
      </div>
    </div>
  );
};

export default AddNews;
