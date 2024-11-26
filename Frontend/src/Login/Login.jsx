import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to show/hide Forgot Password modal
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/logins', { email, password })
      .then(response => {
        if (response.data.accesstoken) {
          login(response.data.accesstoken);
          navigate('/');
        } else {
          setErrorMessage('Token not received. Please try again.');
        }
      })
      .catch(error => {
        setErrorMessage(
          error.response?.data?.error || 'An unexpected error occurred.'
        );
      });
  }

  function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/forgot-password', { email, username, newPassword })
      .then(response => {
        alert(response.data.message);
        setShowForgotPassword(false);
      })
      .catch(error => {
        setForgotPasswordError(
          error.response?.data?.error || 'An unexpected error occurred.'
        );
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
              value={email}
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
              value={password}
            />
          </div>
          <button type='submit' className='btn btn-success'>Log In</button>
          {errorMessage && <div className='alert alert-danger mt-3'>{errorMessage}</div>}
          <p className='mt-2'>You agree to our terms and policies</p>
          <button type='button' className='btn btn-outline-secondary' onClick={() => navigate('/signup')}>Create Account</button>
          <button type='button' className='btn btn-link mt-2' onClick={() => setShowForgotPassword(true)}>Forgot Password?</button>
        </form>

        {showForgotPassword && (
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reset Password</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForgotPassword(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className='mb-3'>
                      <label htmlFor="forgot-email">Email</label>
                      <input
                        type='email'
                        id="forgot-email"
                        className='form-control'
                        placeholder="Enter Email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor="forgot-username">Username</label>
                      <input
                        type='text'
                        id="forgot-username"
                        className='form-control'
                        placeholder="Enter Username"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor="new-password">New Password</label>
                      <input
                        type='password'
                        id="new-password"
                        className='form-control'
                        placeholder="Enter New Password"
                        onChange={e => setNewPassword(e.target.value)}
                        value={newPassword}
                      />
                    </div>
                    {forgotPasswordError && <div className='alert alert-danger'>{forgotPasswordError}</div>}
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
