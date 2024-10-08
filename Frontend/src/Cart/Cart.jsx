

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Nav from '../NavBar/Nav';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPaypal, setShowPaypal] = useState(false);

  useEffect(() => {
    fetchCartItems(); // Call fetchCartItems on initial load
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8081/cart/item');
      setCartItems(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + item.ProductPrice * item.quantity, 0);
    const taxAmount = subTotal * 0.08; // Example: 8% tax
    setSubtotal(subTotal);
    setTax(taxAmount);
    setTotal(subTotal + taxAmount);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return;
      }
    setShowPaypal(true); // Show PayPal button after clicking Checkout
  };

  const handlePaymentSuccess = async (details) => {
    try {
      console.log("Payment successful, details:", details);

      const orderResponse = await axios.post('/order', {
        subtotal,
        tax,
        total,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("Order response:", orderResponse.data);
      const orderId = orderResponse.data.order_id;
      console.log("Created Order ID:", orderId);
      // Prepare order items to be sent to the server
      const orderItemsPromises = cartItems.map(item =>
        axios.post('/order/item', {
          order_Id: orderId,
          productId: item.ProductID,
          quantity: item.quantity,
          price: item.ProductPrice,
          subtotal: subtotal,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      );

      // Wait for all order items to be processed
      await Promise.all(orderItemsPromises);

      const updateProductPromises = cartItems.map(item =>
        axios.put('/products', {
            productId: item.ProductID,
            quantity: item.quantity, // Quantity to reduce
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
    );
    await Promise.all(updateProductPromises);

      // Clear the cart after successful order
      await axios.delete('/cart/item', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert(`Transaction completed by ${details.payer.name.given_name}`);
      fetchCartItems(); // Refresh the cart after checkout

    } catch (error) {
      console.error("Error completing payment:", error);
      alert("Error processing your payment. Please try again.");
    }
  };

  const handleDeleteItem = async (productId) => {
    console.log("Deleting product with ID:", productId);
    try {
      await axios.delete(`/cart/item/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("Product deleted successfully");
      fetchCartItems(); // Refresh cart after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting the product from the cart.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="cart-container">
        <div className='title'><h2>Your Cart ({cartItems.length} items)</h2></div>
        <div className="cart-header">
          <div className="header-item">Item</div>
          <div className="header-price">Price</div>
          <div className="header-quantity">Quantity</div>
          <div className="header-total">Total</div>
          <div className="header-action"></div>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.ProductID} className="cart-item">
              <div className="item-info">
                <img src={item.ProductImg} alt={item.ProductName} className="cart-img" />
                <div className="item-details">
                  <h4>{item.ProductName}</h4>
                  <p>Fuel Source: Wood Only</p>
                </div>
              </div>
              <div className="item-price">
                <p>RM{item.ProductPrice.toFixed(2)}</p>
              </div>
              <div className="item-quantity">
                <p>{item.quantity}</p>
              </div>
              <div className="item-total">
                <p>RM{(item.ProductPrice * item.quantity).toFixed(2)}</p>
              </div>
              <div className="item-action">
                <button onClick={() => handleDeleteItem(item.ProductID)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='summary-container'>
          <div className="cart-summary">
            <div className="total-item">
              <span>Subtotal :</span>
              <span className="amount">RM{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-item">
              <span>GST (8%) :</span>
              <span className="amount">RM{tax.toFixed(2)}</span>
            </div>
            <div className="total-item">
              <span><strong>Total:</strong></span>
              <span className="amount"><strong>RM{total.toFixed(2)}</strong></span>
            </div>
            {!showPaypal && (
              <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
            )}
            {showPaypal && (
              <PayPalScriptProvider options={{ "client-id": "ASXoIbPip1ZFLER1z1KmhlpsN9xJGhjG4OAfGgBGGzU532mun3jpqRMlh6ZxlvDqur2KJyL2UNdSvJP8", "currency": "MYR" }}>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: total.toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(handlePaymentSuccess);
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
