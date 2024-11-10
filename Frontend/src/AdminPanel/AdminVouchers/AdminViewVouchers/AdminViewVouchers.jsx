import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminViewVouchers.css'; // Custom styles for voucher view
import AdminNav from '../../AdminNav';

const AdminViewVouchers = () => {
    const { voucher_id } = useParams(); // Get the voucher ID from the URL
    const navigate = useNavigate(); // Create navigate function
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch voucher details when component mounts
    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await axios.get(`/admindash/voucher/${voucher_id}`);
                setVoucher(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch voucher details');
                setLoading(false);
            }
        };

        fetchVoucher();
    }, [voucher_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!voucher) return <div>Voucher not found</div>;

    // Function to handle "Edit" button click
    const handleEditClick = () => {
        navigate(`/admin/vouchers/edit/${voucher_id}`); // Navigate to the edit page
    };

    return (
        <div className="admin-voucher-view-page">
            <AdminNav /> {/* Sidebar */}
            <div className="admin-voucher-view">
                <h2>Voucher Information</h2>
                <div className="voucher-info">
                    <h3>{voucher.voucher_name}</h3>
                    <p><strong>Type: </strong> {voucher.voucher_type}</p>
                    <p><strong>Quantity Remaining: </strong> {voucher.voucher_quantity}</p>
                    <p>
                        <strong>Amount: </strong> 
                        {voucher.voucher_type === 'Percentage'
                            ? `${voucher.voucher_amount}%`
                            : `RM${voucher.voucher_amount}`}
                    </p>
                    <p><strong>Minimum Spend: </strong> RM {voucher.voucher_min_spend}</p>
                    <p><strong>Maximum Discount: </strong> RM {voucher.voucher_max_disc}</p>
                    <p><strong>Expiration Date: </strong> {new Date(voucher.voucher_expired).toLocaleDateString()}</p>
                    
                    {/* Additional Information Section */}
                    <p><strong>Status: </strong> {voucher.voucher_status ? voucher.voucher_status : 'Active'}</p>

                    {/* Terms & Conditions */}
                    <p><strong>Loyalty Points Needed To Redeem: </strong>{voucher.voucher_loyaltypoints_needed}</p>

                    <button 
                        className="edit-button"
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminViewVouchers;
