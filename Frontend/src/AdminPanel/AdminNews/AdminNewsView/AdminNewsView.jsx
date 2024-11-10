import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../../AdminNav';
import './AdminNewsView.css'

const AdminNewsView = () => {
    const { news_id } = useParams(); // Get news_id from URL params
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsById = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/admindash/news/${news_id}`);
                setNews(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to fetch news.');
                setLoading(false);
            }
        };

        fetchNewsById();
    }, [news_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!news) return <div>No news details available.</div>;

    return (
        <div>
            <AdminNav />
            <div className="admin-news-view-page">
           
                <div className="admin-news-view">
                     <h2>{news.news_title}</h2>
                    <div className="news-info">
                        
                        <div className="news-images">
                            {news.news_img ? (
                                <img
                                    className="news-image"
                                    src={news.news_img}
                                    alt={news.news_title}
                                />
                            ) : (
                                <p>No Image Available</p>
                            )}
                        </div>
                        <h3>{news.news_title}</h3>
                        <p><strong>Description:</strong> {news.news_des}</p>
                        <p><strong>Start Date:</strong> {new Date(news.news_s_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(news.news_e_date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {new Date() > new Date(news.news_e_date) ? 'Expired' : 'Active'}</p>

                        <div className="admin-buttons">
                            
                            <Link to={`/admin/new/edit/${news.news_id}`}>
                                <button className="edit-button">Edit News</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNewsView;
