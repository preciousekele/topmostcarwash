import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './Receipt.css';

const Receipt = ({ transaction, onBack }) => {
  if (!transaction) return null;

  const formatAmount = (amount) => {
    if (typeof amount === 'string' && amount.includes('₦')) {
      return amount;
    }
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <button className="back-buttons" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Receipt</span>
        </button>
      </div>

      <div className="receipt-content">
        <div className="receipt-amount-section">
          <p className="amount-label">Total Amount</p>
          <h1 className="receipt-amount">{formatAmount(transaction.totalAmount)}</h1>
        </div>

        <div className="receipt-details">
          {/* 1. Plate Number */}
          <div className="detail-row">
            <span className="detail-label">Plate Number</span>
            <span className="detail-value">{transaction.plateNumber}</span>
          </div>

          {/* 2. Items Washed and Price */}
          <div className="detail-row items-detail">
            <span className="detail-label">Items Washed</span>
            <div className="items-list-receipt">
              {transaction.items && transaction.items.map((item, index) => (
                <div key={index} className="receipt-item-row">
                  <span className="receipt-item-name">{item.name}</span>
                  <span className="receipt-item-price">₦{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Washer's Name */}
          <div className="detail-row">
            <span className="detail-label">Washer's Name</span>
            <span className="detail-value">{transaction.washerName}</span>
          </div>

          {/* 4. Payment Method */}
          <div className="detail-row">
            <span className="detail-label">Payment Method</span>
            <span className="detail-value">{transaction.paymentMethod}</span>
          </div>

          {/* 5. Date */}
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value">{transaction.date}</span>
          </div>

          {/* 6. Total */}
          <div className="detail-row total-detail">
            <span className="detail-label-total">Total</span>
            <span className="detail-value-total">{formatAmount(transaction.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;