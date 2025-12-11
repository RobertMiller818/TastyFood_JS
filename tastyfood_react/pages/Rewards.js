import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Rewards.css';

const Rewards = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddy: '',
    streetAddy: '',
    aptNo: '',
    city: '',
    state: '',
    zipCode: '',
    typeOfCard: '',
    ccNo: '',
    expDate: '',
    secCode: '',
    streetAddyBill: '',
    aptNoBill: '',
    cityBill: '',
    stateBill: '',
    zipCodeBill: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const isValidCreditNumber = (ccNo) => {
    const ccpattern = /^[0-9]+$/;
    return ccpattern.test(ccNo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.firstName || !formData.lastName) {
      setErrorMessage('Please fill in all name fields: first name and last name.');
      return;
    }

    if (!isValidPhone(formData.phoneNumber)) {
      setErrorMessage('Phone number must be 10 digits long and be all numerical digits.');
      return;
    }

    if (formData.phoneNumber.startsWith('0')) {
      setErrorMessage('Phone number the first digit must not be a zero.');
      return;
    }

    if (!isValidEmail(formData.emailAddy)) {
      setErrorMessage('Email address should follow the format XXX@XXX.XX');
      return;
    }

    if (!formData.streetAddy || !formData.city || !formData.state) {
      setErrorMessage('Delivery address must have at least a Building number, street name, city, and state.');
      return;
    }

    if (!formData.ccNo || !formData.expDate || !formData.secCode) {
      setErrorMessage('Credit Card info requires number, expiry date, and security code.');
      return;
    }

    if (!isValidCreditNumber(formData.ccNo)) {
      setErrorMessage('Credit card numbers can include numbers only.');
      return;
    }

    if (formData.ccNo.length !== 16) {
      setErrorMessage('Credit card numbers must be at least 16 digits long.');
      return;
    }

    if (formData.ccNo.startsWith('0')) {
      setErrorMessage('Credit card numbers cannot start with a 0.');
      return;
    }

    if (formData.secCode.length !== 3) {
      setErrorMessage('Security Code must be 3 digits');
      return;
    }

    if (!formData.streetAddyBill || !formData.cityBill || !formData.stateBill) {
      setErrorMessage('Billing address must have at least a Building number, street name, city, and state.');
      return;
    }

    setSuccessMessage('Rewards submission successful! Return to menu.');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="container">
      <Header showLogin={false} />
      <main className="main-content">
        <div className="rewards-form">
          <h2 className="rewards-title">Rewards Registration</h2>

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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailAddy">Email Address</label>
              <input
                type="text"
                id="emailAddy"
                name="emailAddy"
                value={formData.emailAddy}
                onChange={handleChange}
              />
            </div>

            <h2 className="billing-addy">Delivery Address</h2>

            <div className="form-group">
              <label htmlFor="streetAddy">Bldg Number and Street Address</label>
              <input
                type="text"
                id="streetAddy"
                name="streetAddy"
                value={formData.streetAddy}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="aptNo">Apt or Unit No.</label>
              <input
                type="text"
                id="aptNo"
                name="aptNo"
                value={formData.aptNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <h2 className="credit-card-info">Credit Card Information</h2>

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
                placeholder="MM/DD/YYYY"
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
              <label htmlFor="streetAddyBill">Bldg Number and Street Address</label>
              <input
                type="text"
                id="streetAddyBill"
                name="streetAddyBill"
                value={formData.streetAddyBill}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="aptNoBill">Apt or Unit No.</label>
              <input
                type="text"
                id="aptNoBill"
                name="aptNoBill"
                value={formData.aptNoBill}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cityBill">City</label>
              <input
                type="text"
                id="cityBill"
                name="cityBill"
                value={formData.cityBill}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stateBill">State</label>
              <input
                type="text"
                id="stateBill"
                name="stateBill"
                value={formData.stateBill}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCodeBill">Zip Code</label>
              <input
                type="text"
                id="zipCodeBill"
                name="zipCodeBill"
                value={formData.zipCodeBill}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="rewards-btn">
              Register
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
