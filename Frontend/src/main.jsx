import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Add these imports
import { StrictMode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import Login from './Login/Login.jsx';
import Home from './Home';
import { AuthProvider } from './AuthContext.jsx'; // Fix the import name to AuthContext
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import Signup from './Login/Signup.jsx';
import UserProfile from './User/UserProfile.jsx';
import UpdateProfile from './User/UpdateProfile.jsx';
import ProductPage from './ProductPage/ProductPage.jsx'
import UploadProduct from './AdminPanel/AdminProduct/UploadProduct/UploadProduct.jsx'
import IndividualProduct from './ProductPage/IndividualProduct.jsx'
import Cart from './Cart/Cart.jsx'
import UserOrderHistory from './UserOrderHistory/UserOrderHistory.jsx'
import UserOrderHistoryItem from './UserOrderHistory/UserOrderHistoryItem.jsx'
import ReviewForm from './Review/ReviewForm.jsx';
import AddNews from './AdminPanel/UploadNews/AddNews.jsx'
import ReviewTest from './Review/ReviewTest.jsx';

import AdminRoute from './AdminRoute.jsx';
import AdminDashboard from './AdminPanel/AdminPage/AdminPage.jsx'
import AdminLogin from './AdminPanel/AdminLogin.jsx'
import AdminUpdateProduct from './AdminPanel/AdminProduct/UpdateProduct/UpdateProduct.jsx'
import AdminProduct from './AdminPanel/AdminProduct/AdminProduct.jsx'
import AdminProductView from './AdminPanel/AdminProduct/AdminIndividualProduct/AdminProductView.jsx'




const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> 
          <Route path="/updateProfile" element={<UpdateProfile />}/>
          <Route path="/product" element={<ProductPage/>}/>
          <Route path="/product/:id" element={<IndividualProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/userOrderHistory" element={<UserOrderHistory />} />
          <Route path="/userOrderHistory/:orderId" element={<UserOrderHistoryItem />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/addNews" element={<AddNews />} />
          <Route path="/rev" element={<ReviewTest/>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/product" element={<AdminRoute><AdminProduct /></AdminRoute>} />
          <Route path="/admin/product/edit/:id" element={<AdminRoute><AdminUpdateProduct /></AdminRoute>}/>
          <Route path="/admin/uploadproduct" element={<AdminRoute><UploadProduct/></AdminRoute>}/>
          <Route path="/admin/product/view/:productId" element={<AdminRoute><AdminProductView /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
