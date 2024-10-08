import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css'; // Adjust the path as needed
import Nav from '../NavBar/Nav';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // To store product categories
    const [selectedCategory, setSelectedCategory] = useState('All'); // Default category is 'All'
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Track the user's input

    useEffect(() => {
        // Fetch products
        axios.get('/products')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setError('Unexpected data structure');
                }
            })
            .catch(err => {
                setError('Failed to fetch products');
            });

        // Fetch product categories
        axios.get('/categories')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCategories(['All', ...response.data]);
                } else {
                    setError('Unexpected categories data structure');
                }
            })
            .catch(err => {
                setError('Failed to fetch categories');
            });
    }, []);

    // Filter products based on search term and selected category
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.ProductCat === selectedCategory;
        const matchesSearch = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            <Nav />
            <div className='search_bar'>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Pass the state and setter */}
            </div>
            {/* Category Filter Section */}
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'active' : ''} 
                        
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            <div className="box">
                {error && <p>{error}</p>}
                {filteredProducts.length > 0 ? (
                    <ul className="product-list">
                        {filteredProducts.map(product => (
                            <ul className="product-card" key={product.ProductID}>
                                <Link to={`/product/${product.ProductID}`}>
                                    <div className="image-wrapper">
                                        {/* Display only the first image from the ProductImg array */}
                                        {product.ProductImg.length > 0 && (
                                            <img
                                                src={product.ProductImg[0]} // Access the first image in the array
                                                alt={`Product ${product.ProductID}`}
                                                style={{ width: '200px', height: '200px' }}
                                            />
                                        )}
                                    </div>
                                    <h2>{product.ProductName}</h2>
                                    <p>{product.ProductDes}</p>
                                    <p className="price">Price: RM{product.ProductPrice}</p>
                                </Link>
                            </ul>
                        ))}
                    </ul>
                ) : (
                    !error && <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
