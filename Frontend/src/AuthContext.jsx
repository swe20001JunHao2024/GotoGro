import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from './utils/jwtUtils'; // Adjust the path according to your file structure

// Create a Context for Authentication
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null); // User object to store ID and role

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token to get user data (e.g., role)
            const decodedToken = jwtDecode(token); 
            setUser({ id: decodedToken.id, role: decodedToken.isAdmin ? 'admin' : 'user' });
            // Set the Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // Store the token
        const decodedToken = jwtDecode(token); // Decode the token to get user data (e.g., role)
        setUser({ id: decodedToken.id, role: decodedToken.isAdmin ? 'admin' : 'user' });
        setIsAuthenticated(true); // Update authentication state
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove the token
        setUser(null); // Reset the user data
        setIsAuthenticated(false); // Update authentication state
        delete axios.defaults.headers.common['Authorization']; // Remove the Authorization header
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
