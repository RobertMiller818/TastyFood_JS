import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ordersAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    typeOfCard: '',
    firstName: '',
    lastName: '',
    ccNo: '',
    expDate: '',
    secCode: '',
    billingStreet: '',
    billingApt: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    deliveryStreet: '',
    deliveryApt: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrderItems = localStorage.getItem('orderItems');
    const storedOrderTotals = localStorage.getItem('orderTotals');

    if (!storedOrderItems || !storedOrderTotals) {
      navigate('/');
      return;
    }

    const items = JSON.parse(storedOrderItems);
    const totals = JSON.parse(storedOrderTotals);
    setOrderData({ items, totals });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!formData.typeOfCard || !formData.firstName || !formData.lastName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!orderData) {
      setErrorMessage('No order data found. Please start a new order.');
      return;
    }

    // Show processing message
    setSuccessMessage('Processing your order...');

    try {
      // Get order items and calculate totals
      const orderedItems = Object.values(orderData.items)
        .filter(item => item.quantity > 0)
        .map(item => {
          const parsedId = parseInt(item.id);
          if (isNaN(parsedId)) {
            console.error('Invalid item ID:', item.id, 'for item:', item);
          }
          return {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            itemId: parsedId
          };
        })
        .filter(item => !isNaN(item.itemId)); // Filter out items with invalid IDs

      // Validate that we have valid items
      if (orderedItems.length === 0) {
        setErrorMessage('No valid items found in order. Please start a new order.');
        setSuccessMessage('');
        return;
      }

      // Parse the totals from localStorage
      const { subtotal, serviceCharge, tip, tipPercentage, customTipAmount } = orderData.totals;
      const total = subtotal + serviceCharge + tip;

      // Generate random delivery ETA between 20 and 50 minutes
      const deliveryETA = Math.floor(Math.random() * (50 - 20 + 1)) + 20;

      // Create order object for backend
      const orderPayload = {
        subtotal: subtotal,
        tip: tip,
        total: total,
        deliveryETA: deliveryETA,
        deliveryStatus: 'PENDING',
        items: orderedItems.map(item => ({
          itemId: item.itemId,
          itemCount: item.quantity
        })),
      };

      // Log the payload for debugging
      console.log('Order payload being sent to backend:', JSON.stringify(orderPayload, null, 2));

      // Post order to backend
      const response = await ordersAPI.create(orderPayload);
      const createdOrder = response.data;

      // Create timestamp
      const timestamp = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Create order summary object for frontend display
      const orderSummary = {
        orderNumber: createdOrder.orderNo || 'FD0001',
        items: orderedItems,
        subtotal: subtotal,
        tax: serviceCharge,
        tip: tip,
        tipPercentage: customTipAmount && customTipAmount !== '' ? 'Custom' : (tipPercentage * 100).toFixed(0),
        total: total,
        timestamp: timestamp,
        deliveryAddress: `${formData.deliveryStreet}${formData.deliveryApt ? ', ' + formData.deliveryApt : ''}, ${formData.deliveryCity}, ${formData.deliveryState} ${formData.deliveryZip}`,
        deliveryETA: deliveryETA,
        status: 'pending',
        driver: null,
        orderId: createdOrder.orderNo
      };

      // Store order summary in localStorage for order summary page
      localStorage.setItem('completedOrder', JSON.stringify(orderSummary));

      // Clear the order items and totals from localStorage
      localStorage.removeItem('orderItems');
      localStorage.removeItem('orderTotals');

      // Navigate to order summary page
      navigate('/order-summary');
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      setSuccessMessage('');

      const backendError = error.response?.data?.message || error.response?.data || 'Unknown error';
      setErrorMessage(`Failed to process order: ${backendError}. Please ensure the backend server is running and try again.`);
    }
  };

  return (
    <div className="container">
      <Header showLogin={false} />
      <main className="main-content">
        <div className="checkout-form">
          <h2 className="checkout-title">Payment Information</h2>

          {errorMessage && (
            <div className="error-message" style={{ display: 'block' }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="success-message" style={{ display: 'block' }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="typeOfCard">Type of Card</label>
              <select
                id="typeOfCard"
                name="typeOfCard"
                value={formData.typeOfCard}
                onChange={handleChange}
              >
                <option value="">Select Type of Card</option>
                <option value="mastercard">Mastercard</option>
                <option value="visa">Visa</option>
                <option value="discover">Discover</option>
                <option value="amex">American Express</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ccNo">Credit Card Number</label>
              <input
                type="text"
                id="ccNo"
                name="ccNo"
                value={formData.ccNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expDate">Expiry Date</label>
              <input
                type="text"
                id="expDate"
                name="expDate"
                placeholder="MM/YY"
                value={formData.expDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secCode">Security Code</label>
              <input
                type="text"
                id="secCode"
                name="secCode"
                value={formData.secCode}
                onChange={handleChange}
              />
            </div>

            <h2 className="billing-addy">Billing Address</h2>

            <div className="form-group">
              <label htmlFor="billingStreet">Bldg Number and Street Address</label>
              <input
                type="text"
                id="billingStreet"
                name="billingStreet"
                value={formData.billingStreet}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingApt">Apt or Unit No.</label>
              <input
                type="text"
                id="billingApt"
                name="billingApt"
                value={formData.billingApt}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingCity">City</label>
              <input
                type="text"
                id="billingCity"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingState">State</label>
              <input
                type="text"
                id="billingState"
                name="billingState"
                value={formData.billingState}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingZip">Zip Code</label>
              <input
                type="text"
                id="billingZip"
                name="billingZip"
                value={formData.billingZip}
                onChange={handleChange}
              />
            </div>

            <h2 className="delivery-addy">Delivery Address</h2>

            <div className="form-group">
              <label htmlFor="deliveryStreet">Bldg Number and Street Address</label>
              <input
                type="text"
                id="deliveryStreet"
                name="deliveryStreet"
                value={formData.deliveryStreet}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryApt">Apt or Unit No.</label>
              <input
                type="text"
                id="deliveryApt"
                name="deliveryApt"
                value={formData.deliveryApt}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryCity">City</label>
              <input
                type="text"
                id="deliveryCity"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryState">State</label>
              <input
                type="text"
                id="deliveryState"
                name="deliveryState"
                value={formData.deliveryState}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryZip">Zip Code</label>
              <input
                type="text"
                id="deliveryZip"
                name="deliveryZip"
                value={formData.deliveryZip}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-payment-btn">
              Submit Payment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
