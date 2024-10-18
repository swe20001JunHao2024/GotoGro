import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure the logo path is correct
import './AdminPage/AdminPage.css'; // Optional: separate CSS file for navigation styling

const AdminNav = () => {
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Goto Grocery Logo" className="logo" />
        <h2>Admin Name</h2>
      </div>
      <ul className="nav-list">
        <li className={`nav-item ${isActive('/admin')}`}>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/product')}`}>
          <Link to="/admin/product">Product</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/news')}`}>
          <Link to="/admin/news">News</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/users')}`}>
          <Link to="/admin/users">Users</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/orders')}`}>
          <Link to="/admin/orders">Orders</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/feedbacks')}`}>
          <Link to="/admin/feedbacks">Feedbacks</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
