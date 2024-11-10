import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    // Debugging logs
    console.log('Is Authenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Token:', token);

    // Check if the user is authenticated
    if (!token || !isAuthenticated || !user || user.role !== 'user') {
        console.log('Redirecting to /login'); // Log redirect action
        return <Navigate to="/login" />;
    }

    return children; // Render the protected page if user is authenticated
};

export default ProtectedRoute;
