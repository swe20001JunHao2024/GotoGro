import React, { useState, useEffect } from 'react';
import './AdminVouchers.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav';

const AdminVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const navigate = useNavigate();

    const fetchVouchers = async () => {
        try {
            const response = await axios.get('/admindash/voucher');
            setVouchers(response.data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    return (
        <div className="admin-page">
            <AdminNav />
            <div className="dashboard">
                <div className="admin-buttons">
                    <Link to="/admin/addvouchers">
                        <button className="details-button">Add New Voucher</button>
                    </Link>
                </div>

                <h5>All Vouchers</h5>
                <div>
                    <table className="voucher-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Voucher Name</th>
                                <th>Quantity Remain</th>
                                <th>Amount</th>
                                <th>Expiration Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(vouchers) && vouchers.map((voucher) => (
                                <tr 
                                    key={voucher.voucher_id} 
                                    onClick={() => navigate(`/admin/vouchers/view/${voucher.voucher_id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{voucher.voucher_id}</td>
                                    <td>{voucher.voucher_name}</td>
                                    <td>{voucher.voucher_quantity}</td>
                                    <td>
                                        {voucher.voucher_type === 'Percentage'
                                            ? `${voucher.voucher_amount}%`
                                            : `RM${voucher.voucher_amount}`}
                                    </td>
                                    <td>{new Date(voucher.voucher_expired).toLocaleDateString()}</td>
                                    <td>{new Date(voucher.voucher_expired) > new Date() ? 'Active' : 'Expired'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminVoucher;
