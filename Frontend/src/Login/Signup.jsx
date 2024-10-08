import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [UserHP, setUserHP] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    axios.post('http://localhost:8081/signup', { username, email, UserHP, password })
      .then(res => {
        // Redirect to home page if signup is successful
        navigate('/home');

      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error); // Show the error message from backend
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          {error && <p className='text-danger'>{error}</p>} {/* Display error message */}
          <div className='mb-3'>
            <label htmlFor="username">Username</label>
            <input type='text' id="username" className='form-control' placeholder="Enter Username" 
            onChange={e => setUsername(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor="email">Email</label>
            <input type='email' id="email" className='form-control' placeholder="Enter Email" 
            onChange={e => setEmail(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor="UserHP">Phone Number</label>
            <input type='text' id="UserHP" className='form-control' placeholder="Enter Phone Number" 
            onChange={e => setUserHP(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor="password">Password</label>
            <input type='password' id="password" className='form-control' placeholder="Enter Password" 
            onChange={e => setPassword(e.target.value)} />
          </div>
          <button className='btn btn-success'>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
