import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminEditProfile.css';

const AdminEditProfile = () => {
  const [adminData, setAdminData] = useState({
    admin_name: '',
    admin_email: '',
    admin_hp: '',
    admin_role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch current admin profile data
  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/admindash/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAdminData(response.data); // Set admin data in state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin profile data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData(); // Fetch profile data when component mounts
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/admindash/profile', adminData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Profile updated successfully!');
      navigate('/admin/adminprofile'); // Redirect to profile page after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-edit-profile">
        <h1>Edit Admin Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin_name">Name</label>
            <input
              type="text"
              id="admin_name"
              name="admin_name"
              value={adminData.admin_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin_email">Email</label>
            <input
              type="email"
              id="admin_email"
              name="admin_email"
              value={adminData.admin_email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin_hp">Phone</label>
            <input
              type="text"
              id="admin_hp"
              name="admin_hp"
              value={adminData.admin_hp}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin_role">Role</label>
            <input
              type="text"
              id="admin_role"
              name="admin_role"
              value={adminData.admin_role}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProfile;
