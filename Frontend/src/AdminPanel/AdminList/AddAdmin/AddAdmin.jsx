import React, { useState } from 'react';
import axios from 'axios';
import './AddAdmin.css';
import AdminNav from '../../AdminNav';

const AddAdmin = () => {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminHp, setAdminHp] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Check if the passwords match
        if (adminPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('/admindash/signup', {
                admin_name: adminName,
                admin_email: adminEmail,
                admin_hp: adminHp,
                admin_password: adminPassword,
            });

            if (response.status === 201) {
                setSuccessMessage(response.data.message);
                setAdminName('');
                setAdminEmail('');
                setAdminHp('');
                setAdminPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to register admin');
            }
        }
    };

    return (
        <div className='addadmin-page'>
            <AdminNav />
            <div className="add-admin">
                <h2>Add New Admin</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="adminName">Admin Name:</label>
                        <input
                            type="text"
                            id="adminName"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adminEmail">Email:</label>
                        <input
                            type="email"
                            id="adminEmail"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adminHp">Phone Number:</label>
                        <input
                            type="tel"
                            id="adminHp"
                            value={adminHp}
                            onChange={(e) => setAdminHp(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adminPassword">Password:</label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register Admin</button>
                </form>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Use the new error class */}
            </div>
        </div>
    );
};

export default AddAdmin;
