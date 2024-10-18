import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from '../AdminNav'

const AdminPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/admindash/products');
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-page">
      {/* Reuse AdminNav */}
      <AdminNav />

      {/* Main Dashboard */}
      <div className="dashboard">
        <div className="header">
          <h1>Dashboard</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="cards">
          <div className="card">
            <h3>Total Orders</h3>
            <p>100</p>
          </div>
          <div className="card">
            <h3>Total Members</h3>
            <p>50</p>
          </div>
          <div className="card">
            <h3>Paid Account</h3>
            <p>800</p>
          </div>
        </div>

        {/* Stock Table */}
        <div className="stock-table">
          <h2>All Products</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.map((product) => (
                <tr key={product.ProductID}>
                  <td>{product.ProductID}</td>
                  <td>{product.ProductName}</td>
                  <td>{product.ProductStatus}</td>
                  <td>{product.ProductStock}</td>
                  <td>
                    <Link to={`/admin/product/${product.ProductID}`}>
                      <button className="details-button">Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
