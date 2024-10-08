import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Initialize errorMessage state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use AuthContext

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/logins', { email, password })
        .then(response => {
            console.log('Login response:', response.data); // Debugging line
            if (response.data.accesstoken) {
                login(response.data.accesstoken); // Update the context with the token
                navigate('/'); // Redirect after setting the token
            } else {
                setErrorMessage('Token not received. Please try again.');
            }
        })
        .catch(error => {
            if (error.response) {
                // Handle errors based on response
                setErrorMessage(error.response.data.error || 'An unexpected error occurred.');
            } else {
                // Handle unexpected errors
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
              placeholder="Enter Email"
              onChange={e => setEmail(e.target.value)}
              value={email} // Controlled component
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password">Password</label>
            <input
              type='password'
              id="password"
              className='form-control'
              placeholder="Enter Password"
              onChange={e => setPassword(e.target.value)}
              value={password} // Controlled component
            />
          </div>
          <button type='submit' className='btn btn-success'>Log In</button>
          {errorMessage && <div className='alert alert-danger mt-3'>{errorMessage}</div>} {/* Error message display */}
          <p className='mt-2'>You agree to our terms and policies</p>
          <button type='button' className='btn btn-outline-secondary' onClick={() => navigate('/signup')}>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;