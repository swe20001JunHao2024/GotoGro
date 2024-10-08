import React, { useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';
import Nav from "./NavBar/Nav"
import Hero from './HomeElement/Hero.jsx'
import Reviews from './Review/Review'


function Home() {
  const { logout } = useContext(AuthContext);
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
    //logout(); // Set authentication to false
    navigate('/login');
  }

  return (
    <div>
        <Nav/>
        <Hero/>
        <Reviews/>
        
    </div>
  );
}

export default Home;