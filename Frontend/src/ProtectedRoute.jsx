import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    toast.error('You must be logged in to access this page.'); // Show toast notification
    return <Navigate to="/login" />; // Redirect to the login page
  }

  // If authenticated, render the protected content
  return children;
}

export default ProtectedRoute;
