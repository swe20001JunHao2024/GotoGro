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
import AddNews from './AdminPanel/AdminNews/UploadNews/AddNews.jsx'
import AboutUs from './About/AboutUs.jsx'
import Voucher from './VoucherPage/Voucher.jsx'

import AdminRoute from './AdminRoute.jsx';
import AdminDashboard from './AdminPanel/AdminPage/AdminPage.jsx'
import AdminLogin from './AdminPanel/AdminLogin.jsx'
import AdminUpdateProduct from './AdminPanel/AdminProduct/UpdateProduct/UpdateProduct.jsx'
import AdminProduct from './AdminPanel/AdminProduct/AdminProduct.jsx'
import AdminProductView from './AdminPanel/AdminProduct/AdminIndividualProduct/AdminProductView.jsx'
import AdminNews from './AdminPanel/AdminNews/AdminNews.jsx'
import AdminNewsView from './AdminPanel/AdminNews/AdminNewsView/AdminNewsView.jsx'
import AdminEditNews from './AdminPanel/AdminNews/AdminEditNews/AdminEditNews.jsx'
import AdminUsers from './AdminPanel/AdminUsers/AdminUsers.jsx'
import AdminUserOrders from './AdminPanel/AdminUserOrders/AdminUserOrders.jsx';
import AdminUserOrderItems from './AdminPanel/AdminUserOrders/AdminUserOrderItems.jsx'
import AdminReviews from './AdminPanel/AdminReviews/AdminReview.jsx'
import AdminList from './AdminPanel/AdminList/AdminList.jsx'
import AdminAdd from './AdminPanel/AdminList/AddAdmin/AddAdmin.jsx'
import AdminVouchers from './AdminPanel/AdminVouchers/AdminVouchers.jsx';
import AdminAddVouchers from './AdminPanel/AdminVouchers/AdminAddVouchers/AdminAddVoucers.jsx';
import AdminEditVouchers from './AdminPanel/AdminVouchers/AdminEditVouchers/AdminEditVouchers.jsx'
import AdminViewVouchers from './AdminPanel/AdminVouchers/AdminViewVouchers/AdminViewVouchers.jsx'
import AdminProfile from './AdminPanel/AdminProfile.jsx'
import AdminProfileEdit from './AdminPanel/AdminEditProfile.jsx'
import AdminSalesReport from './AdminPanel/AdminSalesReport/AdminSalesReport.jsx'


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
          <Route path="/updateProfile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
          <Route path="/product" element={<ProtectedRoute><ProductPage/></ProtectedRoute>}/>
          <Route path="/product/:id" element={<ProtectedRoute><IndividualProduct /></ProtectedRoute> }/>
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/userOrderHistory" element={<UserOrderHistory />} />
          <Route path="/userOrderHistory/:orderId" element={<ProtectedRoute><UserOrderHistoryItem /></ProtectedRoute>} />
          <Route path="/voucher" element={<ProtectedRoute><Voucher /></ProtectedRoute>} />
          <Route path="/aboutus" element={<AboutUs />} />

          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/product" element={<AdminRoute><AdminProduct /></AdminRoute>} />
          <Route path="/admin/product/edit/:id" element={<AdminRoute><AdminUpdateProduct /></AdminRoute>}/>
          <Route path="/admin/uploadproduct" element={<AdminRoute><UploadProduct/></AdminRoute>}/>
          <Route path="/admin/product/view/:productId" element={<AdminRoute><AdminProductView /></AdminRoute>} />
          <Route path="/admin/new" element={<AdminRoute><AdminNews /></AdminRoute>} />
          <Route path="/admin/addNews" element={<AdminRoute><AddNews /></AdminRoute>} />
          <Route path="/admin/new/view/:news_id" element={<AdminRoute><AdminNewsView /></AdminRoute>} />
          <Route path="/admin/new/edit/:news_id" element={<AdminRoute><AdminEditNews /></AdminRoute>}/>
          <Route path="/admin/userlist" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminUserOrders /></AdminRoute>} />
          <Route path="/admin/orders/view/:orderId" element={<AdminRoute><AdminUserOrderItems /></AdminRoute>} />
          <Route path="/admin/feedbacks" element={<AdminRoute><AdminReviews /></AdminRoute>} />
          <Route path="/admin/list" element={<AdminRoute><AdminList/></AdminRoute>} />
          <Route path="/admin/addAdmin" element={<AdminRoute><AdminAdd/></AdminRoute>} />
          <Route path="/admin/vouchers" element={<AdminRoute><AdminVouchers/></AdminRoute>} />
          <Route path="/admin/addvouchers" element={<AdminRoute><AdminAddVouchers/></AdminRoute>} />
          <Route path="/admin/vouchers/edit/:voucher_id" element={<AdminRoute><AdminEditVouchers /></AdminRoute>}/>
          <Route path="/admin/vouchers/view/:voucher_id" element={<AdminRoute><AdminViewVouchers /></AdminRoute>}/>
          <Route path="/admin/adminprofile" element={<AdminRoute><AdminProfile/></AdminRoute>} />
          <Route path="/admin/adminprofile/edit" element={<AdminRoute><AdminProfileEdit/></AdminRoute>} />
          <Route path="/admin/sales-report" element={<AdminRoute><AdminSalesReport/></AdminRoute>} />




        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
