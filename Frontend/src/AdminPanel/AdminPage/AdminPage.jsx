import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/admindash/products');
      setProducts(response.data);
      setTotalProducts(response.data.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/admindash/userorders');
      setOrders(response.data);
      setTotalOrders(response.data.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admindash/users');
      setTotalMembers(response.data.length);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  // Filter products with stock below 50
  const lowStockProducts = products.filter(product => product.ProductStock < 50);

  // Filter orders with status "Pending"
  const pendingOrders = orders.filter(order => order.order_status === 'Pending');

  // Function to accept an order
  const acceptOrder = async (orderId) => {
    try {
      await axios.put(`/admindash/userorders/${orderId}`, { order_status: 'Accepted' });
      fetchOrders(); // Refresh orders after updating the status
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  // Function to navigate to order details page
  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/view/${orderId}`);
  };

  return (
    <div className="admin-page">
      <AdminNav />

      <div className="dashboard">
        <div className="header">
          <h1>Dashboard</h1>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="card">
            <h3>Total Members</h3>
            <p>{totalMembers}</p>
          </div>
          <div className="card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
        </div>

        {/* Tables for Low Stock Products and Pending Orders */}
        <div className="additional-info">
          

        <div className="pending-orders">
  <h2>Pending Orders</h2>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>User ID</th>
        <th>Subtotal</th>
        <th>Tax</th>
        <th>Total Price</th>
        <th>Order Date</th>
        
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {pendingOrders.length > 0 ? (
        pendingOrders.map(order => (
          <tr key={order.order_id}>
            <td>{order.order_id}</td>
            <td>{order.UserID}</td>
            <td>RM{order.subtotal}</td>
            <td>RM{order.tax}</td>
            <td>RM{order.total_price}</td>
            <td>{new Date(order.order_date).toLocaleDateString()}</td>
            
            <td>
              <button
                className="details-button"
                onClick={(e) => {
                  e.stopPropagation();
                  acceptOrder(order.order_id);
                }}
              >
                Accept
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">No pending orders.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;
