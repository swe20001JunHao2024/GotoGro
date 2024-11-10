import React, { useState, useEffect } from 'react';
import './AdminUsers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Define navigate here

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admindash/users');
            console.log('User data:', response.data); 
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-page">
            {/* Reuse AdminNav */}
            <AdminNav />

            {/* Main Dashboard */}
            <div className="dashboard">
                {/* Title */}
                <h5>All Users</h5>

                {/* User Table */}
                <div>
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>UserID</th>
                                <th>Username</th>
                                <th>UserEmail</th>
                                <th>UserHP</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.map((user) => (
                                <tr 
                                    key={user.UserID} 
                                    style={{ cursor: 'pointer' }} // Change cursor on hover
                                >
                                    <td>{user.UserID}</td>
                                    <td>{user.Username}</td>
                                    <td>{user.UserEmail}</td>
                                    <td>{user.UserHP}</td>
                                    <td>{user.State}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;
