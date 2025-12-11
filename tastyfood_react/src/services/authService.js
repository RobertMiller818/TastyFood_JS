import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw new Error('Network error. Please check if the backend server is running.');
    }
  },

  changePassword: async (username, oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/change-password`, {
        username,
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw new Error('Unable to connect to backend. Could be a network error. Please check if the backend server is running.');
    }
  }
};

export default authService;
