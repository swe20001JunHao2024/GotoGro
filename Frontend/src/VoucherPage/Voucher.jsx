import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar/Nav';
import VoucherItem from './VoucherItem'; // Import the new component
import './Voucher.css';

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ loyalty_points: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [password, setPassword] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 
  const [collectedVouchers, setCollectedVouchers] = useState([]);
  const [showCollectedModal, setShowCollectedModal] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admindash/voucher');
        setVouchers(response.data);
      } catch (error) {
        setError("Failed to fetch vouchers. Please try again.");
        console.error("Error fetching vouchers:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8081/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user data.");
      }
    };

    fetchVouchers();
    fetchUserProfile();
  }, []);

  const handleVoucherClick = (voucher) => {
    if (user.loyalty_points >= voucher.voucher_loyaltypoints_needed) {
      setSelectedVoucher(voucher);
      setShowModal(true);
    } else {
      alert("You don't have enough loyalty points to redeem this voucher.");
    }
  };

  const handleValidatePassword = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8081/validate-password',
        { userId: user.UserID, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      if (response.status === 200) {
        handleRedeemVoucher();
      }
    } catch (error) {
      console.error("Error validating password:", error);
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleRedeemVoucher = async () => {
    try {
      await axios.post(
        'http://localhost:8081/redeem-voucher',
        { voucher_id: selectedVoucher.voucher_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      alert('Voucher redeemed successfully!');
      setUser(prevUser => ({
        ...prevUser,
        loyalty_points: prevUser.loyalty_points - selectedVoucher.voucher_loyaltypoints_needed,
      }));

      setShowModal(false);
      setPassword("");
      setPasswordError("");
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      alert("Failed to redeem voucher. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword("");
    setPasswordError("");
  };

  const handleShowCollectedVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/voucher_collected', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCollectedVouchers(response.data);
      setShowCollectedModal(true);
    } catch (error) {
      console.error("Error fetching collected vouchers:", error);
      alert("Failed to load collected vouchers. Please try again.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="voucher-page">
        <div className="voucher-header">Redeem Vouchers</div>
        <div className="user-loyalty-points">
          Your Loyalty Points: <span>{user.loyalty_points}</span>
          <button onClick={handleShowCollectedVouchers}>
            View Collected Vouchers
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="voucher-container">
          <div className="voucher-list">
            {vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <VoucherItem
                  key={voucher.voucher_id}
                  voucher={voucher}
                  onClick={() => handleVoucherClick(voucher)}
                />
              ))
            ) : (
              <div>No active vouchers available</div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedVoucher && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Voucher Redemption</h3>
            <p>Are you sure you want to redeem the <strong>{selectedVoucher.voucher_name}</strong> voucher?</p>
            <p>Required Loyalty Points: <strong>{selectedVoucher.voucher_loyaltypoints_needed}</strong></p>
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <div className="modal-actions">
              <button onClick={handleValidatePassword}>Confirm</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCollectedModal && (
        <div className="new-modal-overlay">
          <div className="new-modal-content">
            <h3>Your Collected Vouchers</h3>
            {collectedVouchers.length > 0 ? (
              collectedVouchers.map((voucher) => (
                <VoucherItem
                  key={voucher.voucher_id}
                  voucher={voucher}
                  onClick={() => {}}
                />
              ))
            ) : (
              <p>No vouchers collected.</p>
            )}
            <button onClick={() => setShowCollectedModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voucher;
