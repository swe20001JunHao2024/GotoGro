import React, { useState } from 'react';
import axios from 'axios';
import AdminNav from '../../AdminNav'; // Reuse the AdminNav for sidebar
import './UploadProduct.css'; // Import the CSS file for styling
import { useParams, useNavigate } from 'react-router-dom';

const UploadProduct = () => {
    const [productName, setProductName] = useState('');
    const [productDes, setProductDes] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productStock, setProductStock] = useState('');
    const [productCat, setProductCat] = useState('');
    const [productDiscountPrice, setProductDiscountPrice] = useState('');
    const [productStatus, setProductStatus] = useState('posted');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]); // State to hold image previews

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files); // Multiple files selected

        // Create image preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('ProductName', productName);
        formData.append('ProductDes', productDes);
        formData.append('ProductPrice', productPrice);
        formData.append('ProductStock', productStock);
        formData.append('ProductCat', productCat);
        formData.append('ProductDiscountPrice', productDiscountPrice);
        formData.append('ProductStatus', productStatus);
        
        Array.from(selectedFiles).forEach(file => {
            formData.append('ProductImages', file);
        });

        try {
            const response = await axios.post('http://localhost:8081/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Product uploaded successfully', response.data);
            
            // Clear the form fields and image previews
            setProductName('');
            setProductDes('');
            setProductPrice('');
            setProductStock('');
            setProductCat('');
            setProductDiscountPrice('');
            setProductStatus('posted');
            setSelectedFiles([]);
            setImagePreviews([]);
            
            // Set success message
            setSuccessMessage('Product uploaded successfully!');
            setError(null);

            // Scroll to the top of the page
            navigate(`/admin/product/view/${productId}`);
        } catch (error) {
            console.error('Error uploading product:', error);
            setError('Failed to upload product. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="admin-product-page">
            <AdminNav /> {/* Reuse AdminNav */}
            <div className="upload-product-page">
                <h2>Upload New Product</h2>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="upload-form">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <br />

                    <label>Product Description:</label>
                    <textarea
                        value={productDes}
                        onChange={(e) => setProductDes(e.target.value)}
                    />
                    <br />

                    <label>Product Price:</label>
                    <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                    />
                    <br />

                    <label>Product Stock:</label>
                    <input
                        type="number"
                        value={productStock}
                        onChange={(e) => setProductStock(e.target.value)}
                        required
                    />
                    <br />

                    <label>Product Category:</label>
                    <input
                        type="text"
                        value={productCat}
                        onChange={(e) => setProductCat(e.target.value)}
                        required
                    />
                    <br />

                    <label>Product Discount Price (Optional):</label>
                    <input
                        type="number"
                        value={productDiscountPrice}
                        onChange={(e) => setProductDiscountPrice(e.target.value)}
                    />
                    <br />

                    <label>Product Status:</label>
                    <select value={productStatus} onChange={(e) => setProductStatus(e.target.value)}>
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                        <option value="Out Of Stock">Out Of Stock</option>
                    </select>
                    <br />

                    <label>Product Images:</label>
                    <input type="file" onChange={handleFileChange} multiple required />
                    <br />

                    {/* Display image previews */}
                    <div className="image-preview-box">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                        ))}
                    </div>

                    <button type="submit" className="upload-button">Upload Product</button>
                </form>
            </div>
        </div>
    );
};

export default UploadProduct;
