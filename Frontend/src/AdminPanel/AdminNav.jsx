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
        <li className={`nav-item ${isActive('/admin/new')}`}>
          <Link to="/admin/new">News</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/userlist')}`}>
          <Link to="/admin/userlist">Users</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/orders')}`}>
          <Link to="/admin/orders">Orders</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/feedbacks')}`}>
          <Link to="/admin/feedbacks">Feedbacks</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/list')}`}>
          <Link to="/admin/list">Admin List</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/vouchers')}`}>
          <Link to="/admin/vouchers">Vouchers</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/adminprofile')}`}>
          <Link to="/admin/adminprofile">Profile</Link>
        </li>
        <li className={`nav-item ${isActive('/admin/sales-report')}`}>
          <Link to="/admin/sales-report">Sales Report</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
