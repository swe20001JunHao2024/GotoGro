import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './AdminProductView.css'; // Custom styles
import AdminNav from '../../AdminNav';

const AdminProductView = () => {
    const { productId } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate(); // Create navigate function
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/products/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    // Function to handle "Edit" button click
    const handleEditClick = () => {
        navigate(`/admin/product/edit/${productId}`); // Navigate to the edit page
    };

    return (
        <div className="admin-product-view-page">
            <AdminNav /> {/* Sidebar */}
            <div className="admin-product-view">
                <h2>Product Information</h2>
                <div className="product-info">
                <div className="product-images">
                        <h4>Product Images:</h4>
                        <div className="image-gallery">
                            {product.ProductImg && product.ProductImg.length > 0 ? (
                                product.ProductImg.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`${product.ProductName} Image ${index + 1}`}
                                        className="product-image"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '10px' }}
                                    />
                                ))
                            ) : (
                                <p>No images available</p>
                            )}
                        </div>
                    </div>
                    <h3>{product.ProductName}</h3>
                    <p><strong>Description:</strong> {product.ProductDes}</p>
                    <p><strong>Price:</strong> RM{product.ProductPrice}</p>
                    
                    {/* Display Discount Price only if it's greater than 0 */}
                    {product.ProductDiscountPrice > 0 && (
                        <p><strong>Discounted Price:</strong> RM{product.ProductDiscountPrice}</p>
                    )}

                    <p><strong>Category:</strong> {product.ProductCat}</p>
                    <p><strong>Stock:</strong> {product.ProductStock}</p>
                    <p><strong>Status:</strong> {product.ProductStatus ? "Active" : "Inactive"}</p>
                    
                    
                    <button 
                    className="edit-button"
                    onClick={handleEditClick}
                    >
                    Edit
                </button>
                </div>
                
                
                
            </div>
        </div>
    );
};

export default AdminProductView;
