import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu Items API
export const menuItemsAPI = {
  getAll: () => apiClient.get('/menu-items'),
  getById: (id) => apiClient.get(`/menu-items/${id}`),
  getByItemId: (itemId) => apiClient.get(`/menu-items/item/${itemId}`),
  getByCategory: (category) => apiClient.get(`/menu-items/category/${category}`),
  getAvailable: () => apiClient.get('/menu-items/available'),
  create: (menuItem) => apiClient.post('/menu-items', menuItem),
  update: (id, menuItem) => apiClient.put(`/menu-items/${id}`, menuItem),
  delete: (id) => apiClient.delete(`/menu-items/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  getByOrderNumber: (orderNumber) => apiClient.get(`/orders/order-number/${orderNumber}`),
  getByStatus: (status) => apiClient.get(`/orders/status/${status}`),
  getActive: () => apiClient.get('/orders/active'),
  create: (order) => apiClient.post('/orders', order),
  update: (id, order) => apiClient.put(`/orders/${id}`, order),
  assignDriver: (id, driverId) => {
    const url = `/orders/${id}/assign-driver`;
    console.log('assignDriver API call:', { id, driverId, url, fullUrl: `${API_BASE_URL}${url}` });
    return apiClient.patch(url, { driverId });
  },
  completeOrder: (id) => apiClient.patch(`/orders/${id}/complete-order`),
  markDelivered: (id) => apiClient.patch(`/orders/${id}/mark-delivered`),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: () => apiClient.get('/staff'),
  getById: (id) => apiClient.get(`/staff/${id}`),
  getByUsername: (username) => apiClient.get(`/staff/username/${username}`),
  create: (staff) => apiClient.post('/staff', staff),
  update: (id, staff) => apiClient.put(`/staff/${id}`, staff),
  changePassword: (id, newPassword) => apiClient.patch(`/staff/${id}/change-password`, { newPassword }),
  delete: (id) => apiClient.delete(`/staff/${id}`),
};

// Driver API
export const driverAPI = {
  getAll: () => apiClient.get('/drivers'),
  getById: (id) => apiClient.get(`/drivers/${id}`),
  getByUsername: (username) => apiClient.get(`/drivers/username/${username}`),
  getAvailable: () => apiClient.get('/drivers/available'),
  create: (driver) => apiClient.post('/drivers', driver),
  update: (id, driver) => apiClient.put(`/drivers/${id}`, driver),
  delete: (id) => apiClient.delete(`/drivers/${id}`),
};

// Login Credentials API
export const loginCredentialsAPI = {
  getAll: () => apiClient.get('/login-credentials'),
  getByUsername: (username) => apiClient.get(`/login-credentials/username/${username}`),
  create: (credentials) => apiClient.post('/login-credentials', credentials),
  update: (id, credentials) => apiClient.put(`/login-credentials/${id}`, credentials),
  delete: (id) => apiClient.delete(`/login-credentials/${id}`),
};

export default apiClient;
