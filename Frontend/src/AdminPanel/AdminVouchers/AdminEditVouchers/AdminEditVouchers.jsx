import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminEditVouchers.css';
import AdminNav from '../../AdminNav';

const AdminEditVouchers = () => {
    const { voucher_id } = useParams();
    console.log("voucher_id from useParams:", voucher_id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        voucher_name: '',
        voucher_type: 'Percentage', // Default to 'Percentage'
        voucher_quantity: '',
        voucher_amount: '',
        voucher_min_spend: 0, // Default to 0
        voucher_max_disc: 0, // Default to 0
        voucher_expired: '',
        voucher_status: 'Active', // Default to 'Active'
        voucher_loyaltypoints_needed: '',
    });

    useEffect(() => {
        axios.get(`/admindash/voucher/${voucher_id}`)
            .then(response => {
                const data = response.data;
                const formattedDate = new Date(data.voucher_expired).toISOString().split("T")[0];

                setFormData({
                    voucher_name: data.voucher_name,
                    voucher_type: data.voucher_type,
                    voucher_quantity: data.voucher_quantity,
                    voucher_amount: data.voucher_amount,
                    voucher_min_spend: data.voucher_min_spend || 0,
                    voucher_max_disc: data.voucher_max_disc || 0,
                    voucher_expired: formattedDate,
                    voucher_status: data.voucher_status,
                    voucher_loyaltypoints_needed: data.voucher_loyaltypoints_needed,
                });
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch voucher details");
                setLoading(false);
            });
    }, [voucher_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/admindash/voucher/${voucher_id}`, formData)
            .then(response => {
                alert(response.data.message);
                navigate(`/admin/vouchers/view/${voucher_id}`);
            })
            .catch(err => {
                setError('Failed to update voucher');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-voucher-page">
            <AdminNav />
            <div className="edit-voucher-page">
                <h2>Edit Voucher Details</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="edit-form">
                    <label>Voucher Name:</label>
                    <input
                        type="text"
                        name="voucher_name"
                        value={formData.voucher_name}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label>Voucher Type:</label>
                    <select
                        name="voucher_type"
                        value={formData.voucher_type}
                        onChange={handleInputChange}
                    >
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed Amount">Fixed Amount</option>
                    </select>
                    
                    <label>Voucher Quantity:</label>
                    <input
                        type="number"
                        name="voucher_quantity"
                        value={formData.voucher_quantity}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label>Voucher Amount:</label>
                    <div className="voucher-amount-input">
                        {formData.voucher_type === 'Fixed Amount' && <span>RM</span>}
                        {formData.voucher_type === 'Percentage' && <span>%</span>}
                        <input
                            type="number"
                            name="voucher_amount"
                            value={formData.voucher_amount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <label>Voucher Minimum Spend: RM</label>
                    <input
                        type="number"
                        name="voucher_min_spend"
                        value={formData.voucher_min_spend}
                        onChange={handleInputChange}
                    />
                    
                    <label>Voucher Maximum Discount: RM</label>
                    <input
                        type="number"
                        name="voucher_max_disc"
                        value={formData.voucher_max_disc}
                        onChange={handleInputChange}
                    />
                    
                    <label>Voucher Expiry Date:</label>
                    <input
                        type="date"
                        name="voucher_expired"
                        value={formData.voucher_expired}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label>Voucher Status:</label>
                    <select 
                        name="voucher_status" 
                        value={formData.voucher_status} 
                        onChange={handleInputChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    
                    <label>Voucher Loyalty Points Needed to Redeem:</label>
                    <input
                        type="number"
                        name="voucher_loyaltypoints_needed"
                        value={formData.voucher_loyaltypoints_needed}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit" className="upload-button">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditVouchers;
