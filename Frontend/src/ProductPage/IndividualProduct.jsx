import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // Importing the slider
import './IndividualProduct.css';
import Nav from '../NavBar/Nav';
import Footer from '../Footer/Footer';
// Slick carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const IndividualProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // Quantity state for the cart
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                console.log('Fetched product:', response.data); // Debug log
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Function to handle Add to Cart
    const addToCart = async (productId, quantity) => {
        const token = localStorage.getItem('token'); // Get JWT token from localStorage

        if (quantity > product.ProductStock) {
            alert('Quantity exceeds available stock.');
            return;
        }

        try {
            // Step 1: Ensure the cart exists or create one
            const cartResponse = await axios.get('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const cartId = cartResponse.data.cart_id;

            // Step 2: Post the item to the cart
            const addItemResponse = await axios.post('/cart/item', 
                { ProductID: productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Show success message after adding the item
            setSuccessMessage('Item added to cart successfully!');
            console.log(addItemResponse.data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!product) {
        return <p>Product not found</p>;
    }

    // Slider settings for slick
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, 
    };

    return (
        <div>
            <Nav />
            <div className='product-detail'>
                <div className="product-layout">
                    <div className="carousel-box">
                        {product.ProductImg && product.ProductImg.length > 1 ? (
                            <Slider {...settings}>
                                {product.ProductImg.map((imgUrl, index) => (
                                    <div key={index}>
                                        <img
                                            src={imgUrl}
                                            alt={`${product.ProductName} image ${index + 1}`}
                                            style={{
                                                width: 'auto', 
                                                height: '350px', 
                                                objectFit: 'cover',
                                                marginLeft: '20%'
                                            }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            product.ProductImg.length === 1 && (
                                <img
                                    src={product.ProductImg[0]} // Display the single image directly
                                    alt={`${product.ProductName} image`}
                                    style={{
                                        width: '100%', 
                                        height: '400px', 
                                        objectFit: 'cover' 
                                    }}
                                />
                            )
                        )}
                    </div>

                    <div className="product-data">
                        <h1>{product.ProductName}</h1>
                        <p className={product.ProductDiscountPrice > 0 ? 'original-price' : ''}>
                            Price: RM{product.ProductPrice}
                        </p>
                        {product.ProductDiscountPrice > 0 && (
                            <p className="discounted-price">
                                Discounted Price: RM{product.ProductDiscountPrice}
                            </p>
                        )}
                        <p>Category: {product.ProductCat}</p>

                        {product.ProductStock > 0 && (
                            <div>
                                <label htmlFor="quantity">Quantity: </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    min="1"
                                    max={product.ProductStock} // Set max to available stock
                                />
                            </div>
                        )}

                        {product.ProductStock > 0 ? (
                            <button className="add-to-cart-button" onClick={() => addToCart(product.ProductID, quantity)}>
                                <span>Add to Cart</span>
                            </button>
                        ) : (
                            <button className='out-of-stock-button' disabled>Out of Stock</button>
                        )}

                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>

                {/* Move product description here */}
                <div className="product-description">
                    <p>{product.ProductDes}</p>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default IndividualProduct;
