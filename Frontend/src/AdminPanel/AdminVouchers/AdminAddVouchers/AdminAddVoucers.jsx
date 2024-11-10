import React, { useState } from 'react';
import axios from 'axios';
import AdminNav from '../../AdminNav'; // Reuse the AdminNav for sidebar
import './AdminAddVouchers.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';

const AdminAddVoucher = () => {
    const [voucherName, setVoucherName] = useState('');
    const [voucherType, setVoucherType] = useState('Percentage'); // Default type
    const [voucherQuantity, setVoucherQuantity] = useState('');
    const [voucherAmount, setVoucherAmount] = useState('');
    const [voucherMinSpend, setVoucherMinSpend] = useState(0); // Default to 0
    const [voucherMaxDisc, setVoucherMaxDisc] = useState(0); // Default to 0
    const [voucherExpired, setVoucherExpired] = useState('');
    const [voucherStatus, setVoucherStatus] = useState('');
    const [voucherLoyaltyPointsNeed, setVoucherLoyaltyPointsNeed] = useState('');

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const voucherData = {
            voucher_name: voucherName,
            voucher_type: voucherType,
            voucher_quantity: voucherQuantity,
            voucher_amount: voucherAmount,
            voucher_min_spend: voucherMinSpend,
            voucher_max_disc: voucherMaxDisc,
            voucher_expired: voucherExpired,
            voucher_status: voucherStatus,
            voucher_loyaltypoints_needed: voucherLoyaltyPointsNeed,
        };

        try {
            const response = await axios.post('/admindash/voucher', voucherData);
            console.log('Voucher added successfully', response.data);

            // Clear the form fields
            setVoucherName('');
            setVoucherType('Percentage');
            setVoucherQuantity('');
            setVoucherAmount('');
            setVoucherMinSpend(0); // Reset to default 0
            setVoucherMaxDisc(0); // Reset to default 0
            setVoucherExpired('');
            setVoucherStatus('');
            setVoucherLoyaltyPointsNeed('');

            // Set success message and clear after a few seconds
            setSuccessMessage('Voucher added successfully!');
            setError(null);
            setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds

            navigate('/admin/vouchers'); // Redirect to vouchers page after successful submission
        } catch (error) {
            console.error('Error adding voucher:', error);
            setError('Failed to add voucher. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="admin-voucher-page">
            <AdminNav /> {/* Reuse AdminNav */}
            <div className="add-voucher-page">
                <h2>Add New Voucher</h2>
                {error && <p className="error-message">{error}</p>}
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}
                <form onSubmit={handleSubmit} className="add-voucher-form">
                    <label>Voucher Name:</label>
                    <input
                        type="text"
                        value={voucherName}
                        onChange={(e) => setVoucherName(e.target.value)}
                        required
                    />
                    <br />

                    <label>Voucher Type:</label>
                    <select 
                        value={voucherType} 
                        onChange={(e) => setVoucherType(e.target.value)}>
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed Amount">Fixed Amount</option>
                    </select>
                    <br />

                    <label>Voucher Quantity (Number of vouchers available for redemption): </label>
                    <input
                        type="number"
                        value={voucherQuantity}
                        onChange={(e) => setVoucherQuantity(e.target.value)}
                        required
                    />
                    <br />

                    <label>Voucher Amount:</label>
                    <div className="voucher-amount-input">
                        {voucherType === 'Fixed Amount' && <span>RM</span>}
                        {voucherType === 'Percentage' && <span>%</span>}
                        <input
                            type="number"
                            value={voucherAmount}
                            onChange={(e) => setVoucherAmount(e.target.value)}
                            placeholder={voucherType === 'Percentage' ? 'Enter percentage' : 'Enter amount'}
                            required
                        />
                    </div>
                    <br />

                    <label>Voucher Minimum Spend: RM</label>
                    <input
                        type="number"
                        value={voucherMinSpend}
                        onChange={(e) => setVoucherMinSpend(e.target.value)}
                    />
                    <br />

                    <label>Voucher Maximum Discount: RM</label>
                    <input
                        type="number"
                        value={voucherMaxDisc}
                        onChange={(e) => setVoucherMaxDisc(e.target.value)}
                    />
                    <br />

                    <label>Voucher Expiry Date:</label>
                    <input
                        type="date"
                        value={voucherExpired}
                        onChange={(e) => setVoucherExpired(e.target.value)}
                        required
                    />
                    <br />
                    
                    <label>Voucher Status:</label>
                    <select 
                        value={voucherStatus} 
                        onChange={(e) => setVoucherStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <br />

                    <label>Voucher Loyalty Points Needed to Redeem</label>
                    <input
                        type="number"
                        value={voucherLoyaltyPointsNeed}
                        onChange={(e) => setVoucherLoyaltyPointsNeed(e.target.value)}
                        required
                    />
                    <br />

                    <button type="submit" className="add-button">Add Voucher</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddVoucher;
