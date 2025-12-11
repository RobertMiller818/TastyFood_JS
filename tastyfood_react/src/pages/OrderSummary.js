import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './OrderSummary.css';

const OrderSummary = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [orderTimestamp, setOrderTimestamp] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const storedOrderData = localStorage.getItem('completedOrder');

    if (!storedOrderData) {
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(storedOrderData);
    setOrderData(parsedData);
    setOrderTimestamp(parsedData.timestamp);
    setOrderNumber(parsedData.orderNumber);
  }, [navigate]);

  const handleBackToMenu = () => {
    localStorage.removeItem('completedOrder');
    navigate('/');
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="container">
      <Header showLogin={false} />
      <main className="main-content">
        <div className="order-summary-container">
          <h1 className="order-summary-title">Order Summary</h1>

          <div className="success-message-box">
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
          </div>

          <div className="order-info">
            <div className="order-number">
              <strong>Order Number:</strong> {orderNumber}
            </div>
            <div className="order-timestamp">
              <strong>Order Submitted:</strong> {orderTimestamp}
            </div>
            {orderData.deliveryETA && (
              <div className="order-eta">
                <strong>Estimated Delivery:</strong> {orderData.deliveryETA} minutes
              </div>
            )}
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="order-totals-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (8.25%):</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tip ({orderData.tipPercentage === 'Custom' ? 'Custom' : orderData.tipPercentage + '%'}):</span>
              <span>${orderData.tip.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total-row">
              <span>Total:</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <button className="back-to-menu-btn" onClick={handleBackToMenu}>
            Back to Menu
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderSummary;
