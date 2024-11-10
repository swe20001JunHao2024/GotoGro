import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../AdminNav';
import './AdminUserOrderItems.css';
import { useParams } from 'react-router-dom';

const AdminUserOrderItems = () => {
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Received orderId:', orderId);
        const fetchOrderItems = async () => {
            try {
                const response = await axios.get(`/admin/orders/items/${orderId}`);
                console.log('Order items response:', response.data);
                setOrderItems(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Error fetching order items:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItems();
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <AdminNav />
            <div className="admin-user-order-items">
                <h2>Order Items for Order ID: {orderId}</h2>
                {orderItems.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Product Image</th> {/* New column */}
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.order_item_id}>
                                    <td>{item.order_item_id}</td>
                                    <td>
                                        {item.ProductImg.length > 0 ? (
                                            <img 
                                                src={item.ProductImg[0]} // Display the first image
                                                alt={item.product_name} 
                                                className="product-image" 
                                            />
                                        ) : (
                                            <span>No image available</span>
                                        )}
                                    </td>

                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No items found for this order.</p>
                )}
            </div>
        </div>
    );
};

export default AdminUserOrderItems;
