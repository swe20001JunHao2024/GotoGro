import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Nav.css';
import DefaultProfilePic from '../assets/Default_profpic.jpg';
import axios from 'axios';
import CartIcon from '../assets/shopping_cart.png'

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userProfilePic, setUserProfilePic] = useState(DefaultProfilePic); // State for user profile picture URL
  const [showLogoutBox, setShowLogoutBox] = useState(false); // Controls logout box visibility
  const navigate = useNavigate();
  
  function handleSignOut() {
    const token = localStorage.getItem('token');
    
    // Log the token before removal
    console.log('Token before removal:', token);
    
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Verify and log that the token is removed (should be null)
    const tokenAfterRemoval = localStorage.getItem('token');
    console.log('Token after removal:', tokenAfterRemoval);
    
    // Redirect to login page after signout
    navigate('/login');
  }

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get('/profile', {
            headers: {
              Authorization: `Bearer ${token}` // Send the token with the request
            }
          });

          if (response.data && response.data.UserPP) {
            setIsLoggedIn(true); // User is logged in
            setUserProfilePic(response.data.UserPP || DefaultProfilePic); // Set profile pic or default
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    checkUserLoginStatus();
  }, []); // Runs once after component mounts

  return (
    <nav className="container">
      <h3>GotoGro</h3>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "link active" : "link"}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/product" className={({ isActive }) => isActive ? "link active" : "link"}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/aboutus" className={({ isActive }) => isActive ? "link active" : "link"}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "link active" : "link"}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/review" className={({ isActive }) => isActive ? "link active" : "link"}>
            Review
          </NavLink>
        </li>
      </ul>
        
      <ul>
        {isLoggedIn ? (
          <div className="profile-section">
            <button className="cart-button">
              <NavLink to="/cart">
                <img src={CartIcon} alt="Cart" />
              </NavLink>
            </button>
            <button
              className="profile-button"
              onClick={() => setShowLogoutBox(!showLogoutBox)} // Toggle the logout box
            >
              <img src={userProfilePic} alt="Profile" />
            </button>

            {showLogoutBox && (
              <>
                <div className="logout-overlay"></div>
                <div className="logout-box">
                  <p>Are you sure you want to logout?</p>
                  <button onClick={handleSignOut}>Yes</button>
                  <button onClick={() => setShowLogoutBox(false)}>No</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <NavLink to="/login">
            <button className="button type1">
              <span className="btn-txt">Login</span>
            </button>
          </NavLink>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
