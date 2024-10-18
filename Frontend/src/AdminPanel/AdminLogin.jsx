import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use AuthContext

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/admindash/login', { email, password }) // Admin login API
        .then(response => {
            console.log('Admin Login response:', response.data); // Debugging line
            if (response.data.accesstoken) {
                login(response.data.accesstoken); // Set token in context
                const decodedToken = JSON.parse(atob(response.data.accesstoken.split('.')[1]));
                
                if (decodedToken.isAdmin) { // Check if user is an admin
                    navigate('/admin'); // Redirect to admin dashboard
                } else {
                    setErrorMessage('Access denied. Not an admin.');
                }
            } else {
                setErrorMessage('Token not received. Please try again.');
            }
        })
        .catch(error => {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'An unexpected error occurred.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        });
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email">Email</label>
            <input
              type='email'
              id="email"
              className='form-control'
              placeholder="Enter Admin Email"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password">Password</label>
            <input
              type='password'
              id="password"
              className='form-control'
              placeholder="Enter Admin Password"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type='submit' className='btn btn-success'>Log In as Admin</button>
          {errorMessage && <div className='alert alert-danger mt-3'>{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
