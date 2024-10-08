// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './UserOrderHistory.css'; // Add CSS styling for this component
// import Nav from '../NavBar/Nav'; // Assuming you have a NavBar component
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// const UserOrderHistory = () => {
//   const [nonCompletedOrders, setNonCompletedOrders] = useState([]);
//   const [completedOrders, setCompletedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('/order', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       // Destructure the response data to separate the orders
//       const { nonCompletedOrders, completedOrders } = response.data;
//       setNonCompletedOrders(nonCompletedOrders);
//       setCompletedOrders(completedOrders);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       setLoading(false);
//     }
//   };
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <Nav />
//       <div className="order-history-container">
//         <h2>Order History</h2>

//         {/* Non-completed orders (Pending, Accepted, Delivered) */}
//         <section>
//           <h3>Current Orders</h3>
//           {nonCompletedOrders.length > 0 ? (
//             <div className="order-list">
//               {nonCompletedOrders.map(order => (
//                 <Link key={order.order_id} to={`/userOrderHistory/${order.order_id}`}>
//                   <div className="order-card">
//                     <h4>Order ID: {order.order_id}</h4>
//                     <div className='order-info'>
//                     <p>Order Date: {formatDate(order.order_date)}</p>
//                       <p>Status: {order.order_status}</p>
//                       <p>Subtotal: RM{order.subtotal.toFixed(2)}</p>
//                       <p>Tax: RM{order.tax.toFixed(2)}</p>
//                       <p>Total Price: RM{order.total_price.toFixed(2)}</p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <p>No current orders.</p>
//           )}
//         </section>

//         {/* Completed orders */}
//         <section>
//           <h3>Completed Orders</h3>
//           {completedOrders.length > 0 ? (
//             <div className="order-list">
//               {completedOrders.map(order => (
//                 <Link key={order.order_id} to={`/userOrderHistory/${order.order_id}`}>
//                   <div className="order-card">
//                     <h4>Order ID: {order.order_id}</h4>
//                     <div className='order-info'>
//                         <p>Order Date: {formatDate(order.order_date)}</p>
//                       <p>Status: {order.order_status}</p>
//                       <p>Subtotal: RM{order.subtotal.toFixed(2)}</p>
//                       <p>Tax: RM{order.tax.toFixed(2)}</p>
//                       <p>Total Price: RM{order.total_price.toFixed(2)}</p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <p>No completed orders.</p>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default UserOrderHistory;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserOrderHistory.css'; // Add CSS styling for this component
import Nav from '../NavBar/Nav'; // Assuming you have a NavBar component
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UserOrderHistory = () => {
  const [nonCompletedOrders, setNonCompletedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/order', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Destructure the response data to separate the orders
      const { nonCompletedOrders, completedOrders } = response.data;
      setNonCompletedOrders(nonCompletedOrders);
      setCompletedOrders(completedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Nav />
      <div className="order-history-container">
        <h2>Order History</h2>

        {/* Non-completed orders (Pending, Accepted, Delivered) */}
        <section>
          <h3>Processing Orders</h3>
          {nonCompletedOrders.length > 0 ? (
            <div className="order-list">
              {nonCompletedOrders.map(order => (
                <Link key={order.order_id} to={`/userOrderHistory/${order.order_id}`}>
                  <div className="order-card">
                    <h4>Order ID: {order.order_id}</h4>
                    <div className='order-info'>
                        <div className="info-item">
                        <p><strong>Order Date</strong></p>
                        <p>{formatDate(order.order_date)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Status</strong></p>
                        <p>{order.order_status}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Subtotal</strong></p>
                        <p>RM{order.subtotal.toFixed(2)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Tax</strong></p>
                        <p>RM{order.tax.toFixed(2)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Total</strong></p>
                        <p>RM{order.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No current orders.</p>
          )}
        </section>

        {/* Completed orders */}
        <section>
          <h3>Completed Orders</h3>
          {completedOrders.length > 0 ? (
            <div className="order-list">
              {completedOrders.map(order => (
                <Link key={order.order_id} to={`/userOrderHistory/${order.order_id}`}>
                  <div className="order-card">
                    <h4>Order ID: {order.order_id}</h4>
                    <div className='order-info'>
                    <div className="info-item">
                        <p><strong>Order Date</strong></p>
                        <p>{formatDate(order.order_date)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Status</strong></p>
                        <p>{order.order_status}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Subtotal</strong></p>
                        <p>RM{order.subtotal.toFixed(2)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Tax</strong></p>
                        <p>RM{order.tax.toFixed(2)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Total</strong></p>
                        <p>RM{order.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No completed orders.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserOrderHistory;
