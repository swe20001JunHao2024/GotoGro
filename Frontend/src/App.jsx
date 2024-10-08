import React, { useEffect } from 'react';
import Home from './Home'
import UserProfile from './User/UserProfile'

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  

  

  return (
    <div>
      <Home/>
      
    </div>
  )
}

export default App
