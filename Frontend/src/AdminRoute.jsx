import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Check if the user is authenticated and has admin privileges
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />; // Redirect to admin login if not an admin
  }

  return children; // Render the admin page
};

export default AdminRoute;
