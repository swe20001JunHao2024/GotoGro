import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import './AdminProfile.css';

const AdminProfile = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();

  // Fetch admin profile data
  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/admindash/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
        }
      });
      setAdmin(response.data); // Set the fetched admin data
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin profile data. Please try again later.');
      setLoading(false); // Set loading to false even if there’s an error
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/admin/login'); // Redirect to login page
  };

  // Navigate to the Edit Profile page
  const handleEdit = () => {
    navigate('/admin/adminprofile/edit'); // Redirect to the edit page
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-profile">
        <h1>Admin Profile</h1>
        <div className="profile-details">
          <p><strong>Name:</strong> {admin.admin_name || 'N/A'}</p>
          <p><strong>Email:</strong> {admin.admin_email || 'N/A'}</p>
          <p><strong>HP:</strong> {admin.admin_hp || 'N/A'}</p>
          <p><strong>Role:</strong> {admin.admin_role || 'N/A'}</p>
        </div>
        <div className="button-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          <button className="e-button" onClick={handleEdit}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
