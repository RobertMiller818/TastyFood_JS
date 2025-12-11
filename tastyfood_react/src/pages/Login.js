import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    return usernamePattern.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!isValidUsername(username)) {
      setErrorMessage('Username contains invalid characters. Only letters and numbers are allowed.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(username, password);

      if (response.success) {
        // Check if staff member is inactive
        if (response.userType !== 'admin' && response.status === 'Inactive') {
          setErrorMessage('Your account is inactive. Please contact an administrator.');
          return;
        }

        localStorage.setItem('currentUser', response.username);
        localStorage.setItem('userType', response.userType);

        if (response.userType === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.firstTimeLogin) {
          localStorage.setItem('requiresPasswordChange', 'true');
          navigate('/change-password');
        } else {
          navigate('/staff-dashboard');
        }
      } else {
        setErrorMessage(response.message || 'Incorrect username and password.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/change-password');
  };

  return (
    <main className="main-content">
      <div className="login-form">
        <h2 className="login-title">Log In to Your Account</h2>

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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="forgot-password">
          <button type="button" className="forgot-link" onClick={handleForgotPassword}>
            Forgot your password?
          </button>
        </div>
        <div className="menu-return">
          <button className="menu-btn" onClick={() => navigate('/')}>
            Return to Menu
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
