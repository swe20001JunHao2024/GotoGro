import React, { useState, useEffect } from 'react';
import './AdminProduct.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from '../AdminNav';

const AdminProduct = () => {
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
                {/* Button Section */}
                <div className="admin-buttons">
                    <Link to="/admin/uploadproduct">
                        <button className="details-button">Add New Product</button>
                    </Link>
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
                                        <Link to={`/admin/product/view/${product.ProductID}`}>
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
}

export default AdminProduct;
