import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css'; // Import your CSS file

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    
    // New state for profile fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addressl1, setAddressl1] = useState('');
    const [addressl2, setAddressl2] = useState('');
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [updateError, setUpdateError] = useState(null);
    
    // List of Malaysian states
    const statesOfMalaysia = [
        'Johor', 'Kedah', 'Kelantan', 'Malacca', 'Negeri Sembilan', 'Pahang', 
        'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 
        'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
    ];

    useEffect(() => {
        const accesstoken = localStorage.getItem('token');
        
        if (accesstoken) {
            axios.get('/profile', {
                headers: {
                    authorization: `Bearer ${accesstoken}`
                }
            })
            .then(response => {
                console.log("Profile Response:", response.data);
                if (response.data && response.data.UserID) {
                    setUser(response.data);
                    // Initialize form fields from the fetched user data
                    setUsername(response.data.Username || '');
                    setEmail(response.data.UserEmail || '');
                    setPhone(response.data.UserHP || '');
                    setAddressl1(response.data.Add_l1 || '');
                    setAddressl2(response.data.Add_l2 || '');
                    setState(response.data.State || '');
                    setPostcode(response.data.Postcode || '');
                } else {
                    setError('Unexpected data structure');
                }
            })
            .catch(err => {
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', err);
            });
        } else {
            setError('No token found');
        }
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            setUploadError('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        const accesstoken = localStorage.getItem('token');

        axios.post('/uploadProfilePicture', formData, {
            headers: {
                'authorization': `Bearer ${accesstoken}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log("Upload Response:", response.data);
            if (response.data.message === 'Profile picture updated successfully') {
                alert('Profile picture updated successfully!');
                window.location.reload();
            } else {
                setUploadError(response.data.message || 'Error uploading profile picture');
            }
        })
        .catch(err => {
            setUploadError('Failed to upload profile picture');
            console.error('Error uploading profile picture:', err.response ? err.response.data : err);
        });
    };

    const handleProfileUpdate = () => {
        const accesstoken = localStorage.getItem('token');
        if (!accesstoken) {
            console.error('No access token found');
            setUpdateError('No access token found');
            return;
        }

        const updatedProfile = {
            username,
            email,
            phone,
            addressl1,
            addressl2,
            state,
            postcode
        };
        console.log('Sending request to /updateProfile');
        console.log('Updated Profile:', updatedProfile);
        console.log('Authorization Header:', `Bearer ${accesstoken}`);

        axios.put('/profile', updatedProfile, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            }
        })
        .then(response => {
            if (response.data.success) {
                alert('Profile updated successfully!');
                navigate('/');
                // Optionally refresh the profile data
                window.location.reload();
            } else {
                setUpdateError('Failed to update profile');
            }
        })
        .catch(err => {
            setUpdateError('Error updating profile');
            console.error('Error updating profile:', err);
        });
    };

    return (
        <div className="update-profile-container">
            {error && <p className="error-message">{error}</p>}
            {user ? (
                <div>
                    <h1 className="update-profile-header">Update Profile</h1>
                    
                    <img src={user.UserPP} alt="Profile" className="profile-image" style={{ width: '100px', height: '100px' }} />
                    <input type="file" onChange={handleFileChange} className="input-field" />
                    <button onClick={handleFileUpload} className="submit-button">Upload Profile Picture</button>
                    {uploadError && <p className="error-message">{uploadError}</p>}

                    <label className="label">Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <label className="label">Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <label className="label">Phone Number:</label>
                    <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <label className="label">Address Line 1:</label>
                    <input 
                        type="text" 
                        value={addressl1} 
                        onChange={(e) => setAddressl1(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <label className="label">Address Line 2:</label>
                    <input 
                        type="text" 
                        value={addressl2} 
                        onChange={(e) => setAddressl2(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <label className="label">State:</label>
                    <select 
                        value={state} 
                        onChange={(e) => setState(e.target.value)} 
                        className="input-field"
                    >
                        <option value="">Select a state</option>
                        {statesOfMalaysia.map((state, index) => (
                            <option key={index} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    <br/>

                    <label className="label">Zip Code:</label>
                    <input 
                        type="text" 
                        value={postcode} 
                        onChange={(e) => setPostcode(e.target.value)} 
                        className="input-field"
                    />
                    <br/>

                    <button onClick={handleProfileUpdate} className="submit-button">Update Profile</button>
                    {updateError && <p className="error-message">{updateError}</p>}
                </div>
            ) : (
                !error && <p>Loading...</p>
            )}
        </div>
    );
};

export default UpdateProfile;
