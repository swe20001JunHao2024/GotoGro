import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Nav from '../NavBar/Nav';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [transportFee, setTransportFee] = useState(15); // Default transport fee is RM15
  const [total, setTotal] = useState(0);
  const [voucher, setVoucher] = useState(null); // Store applied voucher
  const [voucherError, setVoucherError] = useState("");
  const [showPaypal, setShowPaypal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false); // Show modal for voucher selection
  const [vouchers, setVouchers] = useState([]); // Store available vouchers

  useEffect(() => {
    fetchCartItems();
    fetchVouchers(); 
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

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/voucher_collected');
      setVouchers(response.data); // Set vouchers
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => {
      const price = item.ProductDiscountPrice || item.ProductPrice; // Use discounted price if available
      return sum + price * item.quantity;
    }, 0);

    // Apply transport fee condition: free if subtotal is above RM100
    const transportCost = subTotal > 100 ? 0 : 15;
    setTransportFee(transportCost);

    const taxAmount = subTotal * 0.08; // Example: 8% tax
    setSubtotal(subTotal);
    setTax(taxAmount);
    let discount = 0;
    if (voucher) {
      discount = voucher.voucher_type === 'Percentage'
        ? Math.min((subTotal * (voucher.voucher_amount / 100)), voucher.voucher_max_disc || subTotal)
        : voucher.voucher_amount;
    }

    // Update the total to reflect discount
    setTotal(subTotal + taxAmount + transportCost - discount); // Include transport fee in total
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
        transportFee, // Include transport fee in the order
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
      const orderItemsPromises = cartItems.map(item => {
        const price = item.ProductDiscountPrice || item.ProductPrice; // Use discounted price if available
        return axios.post('/order/item', {
          order_Id: orderId,
          productId: item.ProductID,
          quantity: item.quantity,
          price: price,
          subtotal: subtotal,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      });

      // Wait for all order items to be processed
      await Promise.all(orderItemsPromises);

      // Reduce product quantities
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

      const points = Math.floor(total);

      await axios.put('/users/loyalty', { points }, {
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

  const handleVoucherApply = (voucherCode) => {
    const selectedVoucher = vouchers.find(voucher => voucher.voucher_name === voucherCode);
    if (selectedVoucher) {
      setVoucher(selectedVoucher);
      setVoucherError('');
      setShowVoucherModal(false); // Close modal after selection
  
      // Recalculate totals with the new voucher applied
      calculateTotals(cartItems);
    } else {
      setVoucherError('Invalid voucher code.');
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
                </div>
              </div>
              <div className="item-price">
                {/* Display discounted price if available, otherwise show regular price */}
                <p>
                  {item.ProductDiscountPrice ? (
                    <>
                      <span className="discount-price">RM{item.ProductDiscountPrice.toFixed(2)}</span>
                      <span className="original-price">RM{item.ProductPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>RM{item.ProductPrice.toFixed(2)}</span>
                  )}
                </p>
              </div>
              <div className="item-quantity">
                <p>{item.quantity}</p>
              </div>
              <div className="item-total">
                {/* Calculate total based on discounted price if available */}
                <p>RM{((item.ProductDiscountPrice || item.ProductPrice) * item.quantity).toFixed(2)}</p>
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
              <span>Transportation Fee :</span>
              <span className="amount">RM{transportFee.toFixed(2)}</span>
            </div>

            

            <div className="voucher-section">
              <button className="apply-voucher-button" onClick={() => setShowVoucherModal(true)}>Apply Voucher</button>
              {voucher && <div className="voucher-applied">Voucher Applied: {voucher.voucher_name}</div>}
              {voucherError && <div className="voucher-error">{voucherError}</div>}
            </div>
            <div className="total-item">
              <span>Discount :</span>
              <span className="amount">
                -RM{voucher ? (voucher.voucher_type === 'Percentage'
                  ? Math.min((subtotal * (voucher.voucher_amount / 100)), voucher.voucher_max_disc || subtotal).toFixed(2)
                  : voucher.voucher_amount.toFixed(2)) : '0.00'}
              </span>
            </div>

            <div className="total-item">
              <span>Total :</span>
              <span className="amount">RM{total.toFixed(2)}</span>
            </div>

            {!showPaypal && (
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            )}
          </div>
        </div>


        {/* Modal for voucher selection */}
        {/* Modal for voucher selection */}
        {showVoucherModal && (
          <div className="voucher-modal">
            <div className="modal-content">
              <h3>Select a Voucher</h3>
              <ul className="voucher-list">
                {vouchers.map((voucher) => (
                  <li key={voucher.voucher_name} onClick={() => handleVoucherApply(voucher.voucher_name)}>
                    {voucher.voucher_name} - Discount: {voucher.voucher_type === 'Percentage' 
                      ? `${voucher.voucher_amount}%` 
                      : `RM${voucher.voucher_amount}`}
                  </li>
                ))}
              </ul>
              <button className="close-modal" onClick={() => setShowVoucherModal(false)}>Close</button>
            </div>
          </div>
        )}

        {showPaypal && (
          <PayPalScriptProvider options={{ "client-id": "sb" }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: total.toFixed(2),
                    },
                  }],
                });
              }}
              onApprove={handlePaymentSuccess}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};

export default Cart;
