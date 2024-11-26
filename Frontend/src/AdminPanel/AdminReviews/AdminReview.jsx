import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminReview.css';
import AdminNav from '../AdminNav';

const AdminReview = () => {
    const [lowRatedReviews, setLowRatedReviews] = useState([]);
    const [highRatedReviews, setHighRatedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/admindash/reviews');
                const reviews = response.data;

                // Separate reviews into two lists based on rating
                const lowRated = reviews.filter(review => review.rating <= 3);
                const highRated = reviews.filter(review => review.rating > 3);

                setLowRatedReviews(lowRated);
                setHighRatedReviews(highRated);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-review">
            <AdminNav />
            <div className="admin-review-list">
                <h5>Low Rated Feedback</h5>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.length > 0 ? (
                        salesData.map((sale, index) => (
                            <tr key={index}>
                            <td>{sale.period}</td>
                            <td>{sale.revenue}</td>
                            <td>{sale.tax}</td>
                            <td>{sale.subtotal}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="4" className="no-data-message">
                            No sales data available for the selected date range.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
<br/>
                <h5>High Rated Feedback</h5>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highRatedReviews.length > 0 ? (
                            highRatedReviews.map(review => (
                                <tr key={review.review_id}>
                                    <td>{review.UserID}</td>
                                    <td>{review.user_name}</td>
                                    <td>{review.rating}</td>
                                    <td>{review.review}</td>
                                    <td>{new Date(review.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No reviews available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReview;
