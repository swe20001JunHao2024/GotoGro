import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateProduct.css';
import AdminNav from '../../AdminNav';

const AdminProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        ProductName: '',
        ProductDes: '',
        ProductPrice: '',
        ProductStock: '',
        ProductCat: '',
        ProductDiscountPrice: '',
        ProductStatus: 'posted',
        ProductImage: null
    });

    // Fetch product details when component mounts
    useEffect(() => {
        axios.get(`/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setFormData({
                    ProductName: response.data.ProductName,
                    ProductDes: response.data.ProductDes,
                    ProductPrice: response.data.ProductPrice,
                    ProductStock: response.data.ProductStock,
                    ProductCat: response.data.ProductCat,
                    ProductDiscountPrice: response.data.ProductDiscountPrice,
                    ProductStatus: response.data.ProductStatus,
                    ProductImage: null // Resetting the image input; existing image will be shown
                });
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch product details');
                setLoading(false);
            });
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image change
    const handleImageChange = (e) => {
        setFormData({ ...formData, ProductImage: e.target.files[0] });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        // Append form data
        Object.keys(formData).forEach((key) => {
            if (key === 'ProductImage' && !formData.ProductImage) {
                // If no new image, retain the existing image URL
                data.append('ProductImage', product.ProductImage); // Keep existing image URL
            } else {
                data.append(key, formData[key]);
            }
        });

        axios.put(`/products/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert(response.data.message); // Show success message
            navigate('/admin'); // Redirect to the product list
        })
        .catch(err => {
            setError('Failed to update product');
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-product-page">
            {/* Sidebar */}
            <AdminNav />

            {/* Main Content Area */}
            <div className="upload-product-page">
                <h2>Edit Product Details</h2>
                {error && <p className="error-message">{error}</p>}
                
                {/* Display current product image */}
                <div className="current-image">
                    {product.ProductImage && (
                        <img
                            src={product.ProductImage} // Display the current image
                            alt="Current Product"
                            style={{ width: '100px', height: '100px' }} // Set appropriate dimensions
                        />
                    )}
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label>Product Name:</label>
                        <input
                            type="text"
                            name="ProductName"
                            value={formData.ProductName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Description:</label>
                        <textarea
                            name="ProductDes"
                            value={formData.ProductDes}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Price (RM):</label>
                        <input
                            type="number"
                            name="ProductPrice"
                            value={formData.ProductPrice}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Stock:</label>
                        <input
                            type="number"
                            name="ProductStock"
                            value={formData.ProductStock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Category:</label>
                        <input
                            type="text"
                            name="ProductCat"
                            value={formData.ProductCat}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Discount Price (Optional):</label>
                        <input
                            type="number"
                            name="ProductDiscountPrice"
                            value={formData.ProductDiscountPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Status:</label>
                        <select
                            name="ProductStatus"
                            value={formData.ProductStatus}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="posted">Posted</option>
                            <option value="unposted">Unposted</option>
                            <option value="out of stock">Out of Stock</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Upload New Product Image (Optional):</label>
                        <input
                            type="file"
                            name="ProductImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit" className="upload-button">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default AdminProductDetails;
