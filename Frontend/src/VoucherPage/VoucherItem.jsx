// VoucherItem.jsx
import React from 'react';
import './Voucher.css';

const VoucherItem = ({ voucher, onClick }) => {
  return (
    <div className="voucher-item" onClick={onClick}>
      <div className="voucher-left">
        <div className="voucher-item-type">
          {voucher.voucher_type === 'Percentage' 
            ? `${voucher.voucher_amount}% Off` 
            : `RM${voucher.voucher_amount} Off`}
        </div>
      </div>
      <div className="voucher-right">
        <div className="voucher-item-header">{voucher.voucher_name}</div>
        <div className="voucher-item-details">
          {voucher.voucher_type === 'Percentage' && (
            <p>Max Discount: {voucher.max_discount ? `RM${voucher.max_discount}` : "No Max Limit"}</p>
          )}
          <p>Minimum Spend: RM{voucher.voucher_min_spend}</p>
        </div>
        <div className="voucher-item-footer">
          Expired Date: <span className="status">{new Date(voucher.voucher_expired).toLocaleDateString()}</span>
          <br />
          
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;
