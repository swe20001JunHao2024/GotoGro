// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import Link
// import './AdminUserOrders.css';
// import axios from 'axios';
// import AdminNav from '../AdminNav';

// const AdminUserOrders = () => {
//     const [orders, setOrders] = useState({
//         pending: [],
//         accepted: [],
//         delivered: [],
//         completed: [],
//     });

//     // Fetch orders on component mount
//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // Function to fetch orders
//     const fetchOrders = async () => {
//         try {
//             const response = await axios.get('/admin/userorders');
//             console.log('API response:', response.data); // Check the structure of the data
//             const allOrders = Array.isArray(response.data) ? response.data : response.data.orders;

//             // Separate orders by status
//             const pending = allOrders.filter(order => order.order_status === 'Pending');
//             const accepted = allOrders.filter(order => order.order_status === 'Accepted');
//             const delivered = allOrders.filter(order => order.order_status === 'Delivered');
//             const completed = allOrders.filter(order => order.order_status === 'Completed');

//             setOrders({ pending, accepted, delivered, completed });
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//         }
//     };

//     // Function to handle status change
//     const handleStatusChange = async (orderId, newStatus) => {
//         try {
//             await axios.put(`/admin/userorders/${orderId}`, { order_status: newStatus }); // Update the API endpoint

//             // Re-fetch orders after updating the status
//             fetchOrders();
//         } catch (error) {
//             console.error('Error updating order status:', error);
//         }
//     };

//     return (
//         <div className="admin-page">
//             <AdminNav />

//             <div className="dashboard">
//                 <h5>All User Orders</h5>

//                 {/* Pending Orders */}
//                 <div className="order-section">
//                     <h6>Pending Orders</h6>
//                     <OrderTable orders={orders.pending} onStatusChange={handleStatusChange} />
//                 </div>

//                 {/* Accepted Orders */}
//                 <div className="order-section">
//                     <h6>Accepted Orders</h6>
//                     <OrderTable orders={orders.accepted} onStatusChange={handleStatusChange} />
//                 </div>

//                 {/* Delivered Orders */}
//                 <div className="order-section">
//                     <h6>Delivered Orders</h6>
//                     <OrderTable orders={orders.delivered} onStatusChange={handleStatusChange} />
//                 </div>

//                 {/* Completed Orders */}
//                 <div className="order-section">
//                     <h6>Completed Orders</h6>
//                     <OrderTable orders={orders.completed} onStatusChange={handleStatusChange} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // OrderTable Component
// // OrderTable Component
// const OrderTable = ({ orders, onStatusChange }) => {
//     if (orders.length === 0) return <p>No orders in this category.</p>;
//     const navigate = useNavigate();
//     // Function to handle row click
//     const handleRowClick = (orderId) => {
//         navigate(`/admin/orders/view/${orderId}`);
//     };

//     return (
//         <table className="order-table">
//             <thead>
//                 <tr>
//                     <th>Order ID</th>
//                     <th>User ID</th>
//                     <th>Subtotal</th>
//                     <th>Tax</th>
//                     <th>Total Price</th>
//                     <th>Order Date</th>
//                     <th>Status</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {orders.map((order) => (
//                     <tr key={order.order_id} onClick={() => handleRowClick(order.order_id)} style={{ cursor: 'pointer' }}>
//                         <td>{order.order_id}</td>
//                         <td>{order.UserID}</td>
//                         <td>{order.subtotal}</td>
//                         <td>{order.tax}</td>
//                         <td>{order.total_price}</td>
//                         <td>{new Date(order.order_date).toLocaleDateString()}</td>
//                         <td>
//                             <select
//                                 value={order.order_status}
//                                 onChange={(e) => onStatusChange(order.order_id, e.target.value)}
//                             >
//                                 <option value="Pending">Pending</option>
//                                 <option value="Accepted">Accepted</option>
//                                 <option value="Delivered">Delivered</option>
//                                 <option value="Completed">Completed</option>
//                             </select>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// };


// export default AdminUserOrders;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AdminUserOrders.css';
import axios from 'axios';
import AdminNav from '../AdminNav';

const AdminUserOrders = () => {
    const [orders, setOrders] = useState({
        pending: [],
        accepted: [],
        delivered: [],
        completed: [],
    });
    
    const [currentStatus, setCurrentStatus] = useState('Pending'); // State for current order status

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to fetch orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get('/admindash/userorders');
            console.log('API response:', response.data);
            const allOrders = Array.isArray(response.data) ? response.data : response.data.orders;

            // Separate orders by status
            const pending = allOrders.filter(order => order.order_status === 'Pending');
            const accepted = allOrders.filter(order => order.order_status === 'Accepted');
            const delivered = allOrders.filter(order => order.order_status === 'Delivered');
            const completed = allOrders.filter(order => order.order_status === 'Completed');

            setOrders({ pending, accepted, delivered, completed });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Function to handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/admindash/userorders/${orderId}`, { order_status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Function to change current status
    const handleStatusButtonClick = (status) => {
        setCurrentStatus(status);
    };

    return (
        <div className="admin-page">
            <AdminNav />
            <div className="dashboard">
                <h5>All User Orders</h5>

                {/* Status Buttons */}
                <div className="status-buttons">
                    {['Pending', 'Accepted', 'Delivered', 'Completed'].map((status) => (
                        <button 
                            key={status} 
                            onClick={() => handleStatusButtonClick(status)} 
                            className={`status-button ${currentStatus === status ? 'active' : ''}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <OrderTable 
                    orders={orders[currentStatus.toLowerCase()]} 
                    onStatusChange={handleStatusChange} 
                />
            </div>
        </div>
    );
};

// OrderTable Component
const OrderTable = ({ orders, onStatusChange }) => {
    if (orders.length === 0) return <p>No orders in this category.</p>;
    const navigate = useNavigate();

    const handleRowClick = (orderId) => {
        navigate(`/admin/orders/view/${orderId}`);
    };

    return (
        <table className="order-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Subtotal</th>
                    <th>Tax</th>
                    <th>Total Price</th>
                    <th>Order Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.order_id} onClick={() => handleRowClick(order.order_id)} // Set the onClick handler here
                    style={{ cursor: 'pointer' }}>
                        <td>{order.order_id}</td>
                        <td>{order.UserID}</td>
                        <td>{order.subtotal}</td>
                        <td>{order.tax}</td>
                        <td>{order.total_price}</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>
                            <select
                                value={order.order_status}
                                onChange={(e) => onStatusChange(order.order_id, e.target.value)}
                                onClick={(e) => e.stopPropagation()} 
                            >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AdminUserOrders;
