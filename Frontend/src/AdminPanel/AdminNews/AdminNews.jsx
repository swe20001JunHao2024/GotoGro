import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminNews.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminNav from '../AdminNav';

const AdminNews = () => {
    const [currentNews, setCurrentNews] = useState([]);
    const [futureNews, setFutureNews] = useState([]);
    const [expiredNews, setExpiredNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8081/admindash/news');
                const { currentNews = [], futureNews = [], expiredNews = [] } = response.data; // Set default values to empty arrays

                console.log('Current News:', currentNews); // Debugging logs
                console.log('Future News:', futureNews);
                console.log('Expired News:', expiredNews);

                setCurrentNews(currentNews);
                setFutureNews(futureNews);
                setExpiredNews(expiredNews);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to fetch news.');
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <AdminNav />
            <div className="admin-news-page">
                <div className="admin-buttons">
                    <Link to="/admin/addNews">
                        <button className="details-button">Add News</button>
                    </Link>
                </div>
                <h5>Current and Future News</h5>
                <table className="news-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    {/* Rendering Current News */}
                    <tbody>
                        {currentNews.length > 0 ? (
                            currentNews.map((news) => (
                                <tr 
                                    key={news.news_id} 
                                    onClick={() => navigate(`/admin/new/view/${news.news_id}`)} // Click to navigate
                                    style={{ cursor: 'pointer' }} // Change cursor on hover
                                >
                                    <td>{news.news_title}</td>
                                    <td>{news.news_des}</td>
                                    <td>{new Date(news.news_s_date).toLocaleDateString()}</td>
                                    <td>{new Date(news.news_e_date).toLocaleDateString()}</td>
                                    <td>
                                        {news.news_img ? (
                                            <img
                                                src={news.news_img}
                                                alt={news.news_title}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No current news available.</td>
                            </tr>
                        )}
                    </tbody>

                    {/* Rendering Future News */}
                    <tbody>
                        {futureNews.length > 0 ? (
                            futureNews.map((news) => (
                                <tr 
                                    key={news.news_id} 
                                    onClick={() => navigate(`/admin/new/view/${news.news_id}`)} // Click to navigate
                                    style={{ cursor: 'pointer' }} // Change cursor on hover
                                >
                                    <td>{news.news_title}</td>
                                    <td>{news.news_des}</td>
                                    <td>{new Date(news.news_s_date).toLocaleDateString()}</td>
                                    <td>{new Date(news.news_e_date).toLocaleDateString()}</td>
                                    <td>
                                        {news.news_img ? (
                                            <img
                                                src={news.news_img}
                                                alt={news.news_title}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No future news available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <h5>Expired News</h5>
                <table className="news-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expiredNews.length > 0 ? (
                            expiredNews.map((news) => (
                                <tr 
                                    key={news.news_id} 
                                    onClick={() => navigate(`/admin/new/view/${news.news_id}`)} // Click to navigate
                                    style={{ cursor: 'pointer' }} // Change cursor on hover
                                >
                                    <td>{news.news_title}</td>
                                    <td>{news.news_des}</td>
                                    <td>{new Date(news.news_s_date).toLocaleDateString()}</td>
                                    <td>{new Date(news.news_e_date).toLocaleDateString()}</td>
                                    <td>
                                        {news.news_img ? (
                                            <img
                                                src={news.news_img}
                                                alt={news.news_title}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No expired news available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNews;
