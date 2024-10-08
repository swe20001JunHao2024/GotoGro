// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(); // Named export

// const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         } else {
//             delete axios.defaults.headers.common['Authorization'];
//         }
//     }, []);

//     const login = (token) => {
//         localStorage.setItem('token', token);
//         setIsAuthenticated(true);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         delete axios.defaults.headers.common['Authorization'];
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export { AuthContext, AuthProvider }; // Ensure named exports





import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a Context for Authentication
const AuthContext = createContext(); 

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // Store the token
        setIsAuthenticated(true); // Update authentication state
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove the token
        setIsAuthenticated(false); // Update authentication state
        delete axios.defaults.headers.common['Authorization']; // Remove the Authorization header
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
