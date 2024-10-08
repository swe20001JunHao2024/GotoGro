import React, { useState } from 'react';
import axios from 'axios';

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

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files); // Multiple files selected
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
            setSuccessMessage('Product uploaded successfully!');
            setError(null);
            } catch (error) {
                console.error('Error uploading product:', error);
                setError('Failed to upload product. Please try again.');
                setSuccessMessage('');        }
    };

    return (
        <div>
            <h1>Upload New Product</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
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
                    <option value="posted">Posted</option>
                    <option value="unposted">Unposted</option>
                </select>
                <br />

                <label>Product Images:</label>
                <input type="file" onChange={handleFileChange} multiple required />
                <br />

                <button type="submit" >Upload Product</button>
            </form>
        </div>
    );
};

export default UploadProduct;
