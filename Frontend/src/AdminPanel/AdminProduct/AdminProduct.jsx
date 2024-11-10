import React, { useState, useEffect } from 'react';
import './AdminProduct.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav';

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Define navigate here

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
                <h5>All Products</h5>
                <div>
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Status</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(products) && products.map((product) => (
                                <tr 
                                    key={product.ProductID} 
                                    onClick={() => navigate(`/admin/product/view/${product.ProductID}`)} // Click to navigate
                                    style={{ cursor: 'pointer' }} // Change cursor on hover
                                >
                                    <td>{product.ProductID}</td>
                                    <td>
                                        <img 
                                            src={product.ProductImg[0]} // Ensure this is valid
                                            alt={product.ProductName} 
                                            className="product-image" 
                                        />
                                    </td>
                                    <td>{product.ProductName}</td>
                                    <td>{product.ProductStatus}</td>
                                    <td>{product.ProductStock}</td>
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
