import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DefaultProfilePic from '../assets/Default_profpic.jpg'; // Default image if no UserPP
import './UserProfile.css';
import Nav from '../NavBar/Nav'


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const accesstoken = localStorage.getItem('token');
        if (accesstoken) {
            axios.get('/profile', {
                headers: {
                    authorization: `Bearer ${accesstoken}`
                }
            })
            .then(response => {
                if (response.data && response.data.UserID) {
                    setUser(response.data);
                } else {
                    setError('Unexpected data structure');
                }
            })
            .catch(err => {
                setError('Failed to fetch user data');
            });
        } else {
            setError('No token found');
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateProfileClick = () => {
        navigate('/updateProfile');
    };

    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) {
            setResetError('New passwords do not match');
            return;
        }

        const accesstoken = localStorage.getItem('token');
        axios.put('/resetPassword', { oldPassword, newPassword }, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            }
        })
        .then(response => {
            if (response.data.success) {
                alert('Password reset successfully!');
                setShowResetModal(false);
            } else {
                setResetError(response.data.message || 'Failed to reset password');
            }
        })
        .catch(() => {
            setResetError('Error resetting password');
        });
    };

    return (
        <div>
            <Nav />
            <div className="user-profile">
                {error && <p>{error}</p>}
                {user ? (
                    <div className="profile-container">
                        {/* Left Section: Profile Image and Username */}
                        <div className="left-section">
                            <img 
                                src={user.UserPP || DefaultProfilePic} 
                                alt="Profile" 
                                className="profile-pic"
                            />
                            <h2>{user.Username}</h2>
                        </div>

                        {/* Right Section: User Information */}
                        <div className="right-section">
                            <div className="info-group">
                                <h3>Email:</h3>
                                <p>{user.UserEmail}</p>
                            </div>
                            <div className="info-group">
                                <h3>Phone:</h3>
                                <p>{user.UserHP}</p>
                            </div>
                            <div className="info-group">
                                <h3>Address Line 1:</h3>
                                <p>{user.Add_l1}</p>
                            </div>
                            <div className="info-group">
                                <h3>Address Line 2:</h3>
                                <p>{user.Add_l2}</p>
                            </div>
                            <div className="info-group">
                                <h3>Postcode:</h3>
                                <p>{user.Postcode}</p>
                            </div>
                            <div className="info-group">
                                <h3>State:</h3>
                                <p>{user.State}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={() => navigate('/userOrderHistory')}>Order History</button>
                                <button onClick={handleUpdateProfileClick}>Update Profile</button>
                                <button onClick={() => setShowResetModal(true)}>Reset Password</button>
                            </div>
                        </div>

                        {/* Modal for Reset Password */}
                        {showResetModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h2>Reset Password</h2>
                                    <label>Old Password:</label>
                                    <input 
                                        type="password" 
                                        value={oldPassword} 
                                        onChange={(e) => setOldPassword(e.target.value)} 
                                    />
                                    <br />

                                    <label>New Password:</label>
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                    />
                                    <br />

                                    <label>Confirm New Password:</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                    />
                                    <br />

                                    <button onClick={handleResetPassword}>Submit</button>
                                    <button onClick={() => {
                                        setShowResetModal(false);
                                        // Clear input fields
                                        setOldPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}>Cancel</button>
                                    {resetError && <p>{resetError}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    !error && <p>Loading...</p>
                )}
            </div>
        </div>
    );
};


export default UserProfile;
