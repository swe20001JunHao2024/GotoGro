import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../../AdminNav';
import './AdminEditNews.css';

const AdminEditNews = () => {
    const { news_id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState({
        news_title: '',
        news_des: '',
        news_s_date: '',
        news_e_date: '',
        news_img: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchNewsById = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/admindash/news/${news_id}`);
                const fetchedNews = response.data;

                const formattedStartDate = new Date(fetchedNews.news_s_date).toISOString().split('T')[0];
                const formattedEndDate = new Date(fetchedNews.news_e_date).toISOString().split('T')[0];

                setNews({
                    ...fetchedNews,
                    news_s_date: formattedStartDate,
                    news_e_date: formattedEndDate
                });

                if (fetchedNews.news_img) {
                    setImagePreview(fetchedNews.news_img);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to fetch news details.');
                setLoading(false);
            }
        };

        fetchNewsById();
    }, [news_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNews({ ...news, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNews({ ...news, news_img: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('news_title', news.news_title);
        formData.append('news_des', news.news_des);
        formData.append('news_s_date', news.news_s_date);
        formData.append('news_e_date', news.news_e_date);
        if (news.news_img) {
            formData.append('news_img', news.news_img);
        }

        try {
            const response = await axios.put(`http://localhost:8081/admindash/news/${news_id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                setSuccessMessage('News updated successfully!');
                setTimeout(() => {
                    setSuccessMessage(''); // Clear the success message
                    navigate('/admin/new'); // Navigate to the correct path
                }, 3000);
            } else {
                setError('Failed to update news.');
            }
        } catch (err) {
            console.error('Error updating news:', err);
            setError('Failed to update news.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-edit-news-page">
            <AdminNav />
            {/* Display success message as a jump box at the center top */}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
            <div className="dashboard">
                <div className="header">
                    <h2>Edit News</h2>
                </div>
                <div className="update-content">
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="news_title" 
                            placeholder="News Title" 
                            value={news.news_title} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <textarea 
                            name="news_des" 
                            placeholder="News Description" 
                            value={news.news_des} 
                            onChange={handleInputChange} 
                            required 
                        ></textarea>
                        <input 
                            type="date" 
                            name="news_s_date" 
                            value={news.news_s_date} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="date" 
                            name="news_e_date" 
                            value={news.news_e_date} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="file" 
                            name="news_img" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                        {imagePreview && <img src={imagePreview} alt="New Preview" className="image-preview" />}
                        <button type="submit">Update News</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminEditNews;
