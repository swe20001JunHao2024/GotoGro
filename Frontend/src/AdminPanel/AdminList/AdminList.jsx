import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminList.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import AdminNav from '../AdminNav';

const AdminList = () => {
    const [adminList, setAdminList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminList = async () => {
            try {
                const response = await axios.get('/admindash/adminlist');
                setAdminList(response.data);
            } catch (err) {
                console.error('Error fetching admin list:', err);
                setError('Failed to load admin list');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminList();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className='admin-list'>
            <AdminNav/>
            <div className="admin-list-container">
                <div className="admin-buttons">
                    <Link to="/admin/addAdmin">
                        <button className="details-button">Add New Admin</button>
                    </Link>
                </div>
                <h5>Admin List</h5>
                {adminList.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Admin ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Admin Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminList.map(admin => (
                                <tr key={admin.admin_id}>
                                    <td>{admin.admin_id}</td>
                                    <td>{admin.admin_name}</td>
                                    <td>{admin.admin_email}</td>
                                    <td>{admin.admin_hp}</td>
                                    <td>{admin.admin_role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <tr>
                        <td colSpan="4">No admins available.</td>
                    </tr>
                )}
            </div>
        </div>
    );
};

export default AdminList;
