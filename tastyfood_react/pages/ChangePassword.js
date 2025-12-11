import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Header from '../components/Header';
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if coming from first-time login or forgot password
    const requiresPasswordChange = localStorage.getItem('requiresPasswordChange');
    const currentUser = localStorage.getItem('currentUser');

    if (requiresPasswordChange && currentUser) {
      // Coming from first-time login
      setIsForgotPassword(false);
    } else {
      // Coming from forgot password link
      setIsForgotPassword(true);
    }
  }, [navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isForgotPassword && !username) {
      setErrorMessage('Please enter your username.');
      return;
    }

    if (!isForgotPassword && !currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const userToUpdate = isForgotPassword ? username : localStorage.getItem('currentUser');

    if (!userToUpdate) {
      setErrorMessage('Unable to identify user.');
      return;
    }

    setIsLoading(true);

    try {
      const oldPassword = isForgotPassword ? 'password' : currentPassword;
      const response = await authService.changePassword(userToUpdate, oldPassword, newPassword);

      if (response.success) {
        localStorage.removeItem('requiresPasswordChange');
        setSuccessMessage('Password changed successfully! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(response.message || 'Failed to change password.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header showLogin={false} />
      <main className="main-content">
        <div className="change-password-form">
          <h2 className="change-password-title">
            {isForgotPassword ? 'Reset Your Password' : 'Change Your Password'}
          </h2>
          <p className="change-password-subtitle">
            {isForgotPassword
              ? 'Enter your username and create a new password.'
              : 'You are using a default password. Please create a new password to continue.'}
          </p>

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
            {isForgotPassword && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            {!isForgotPassword && (
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <small className="password-requirements">
                Password must be at least 8 characters and include uppercase, lowercase, and a number.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="change-password-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isForgotPassword ? 'Reset Password' : 'Change Password')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
