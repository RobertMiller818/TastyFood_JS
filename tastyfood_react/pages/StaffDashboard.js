import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ordersAPI, driverAPI, menuItemsAPI } from '../services/api';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [deliveryTimes, setDeliveryTimes] = useState({});

  useEffect(() => {
    // Check if user needs to change password
    const requiresPasswordChange = localStorage.getItem('requiresPasswordChange');
    if (requiresPasswordChange === 'true') {
      navigate('/change-password');
      return;
    }

    // Load orders and drivers
    loadOrders();
    loadDrivers();
    loadAllDrivers();
    loadCompletedOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      // Fetch both active orders and menu items
      const [ordersResponse, menuItemsResponse] = await Promise.all([
        ordersAPI.getActive(),
        menuItemsAPI.getAll()
      ]);

      const backendOrders = ordersResponse.data;
      const menuItems = menuItemsResponse.data;

      // Create a map of menu items by itemId for quick lookup
      const menuItemMap = {};
      menuItems.forEach(item => {
        menuItemMap[item.itemId] = item.itemName;
      });

      // Transform backend orders to match frontend format
      const formattedOrders = backendOrders.map(order => {
        console.log('Backend order:', order); // Debug log to see what fields are available

        // Combine orderDate and orderTime into a single timestamp
        let timestamp = 'N/A';
        if (order.orderDate && order.orderTime) {
          // Backend sends orderDate as "YYYY-MM-DD" and orderTime as "HH:MM:SS"
          const dateTimeString = `${order.orderDate}T${order.orderTime}`;
          timestamp = new Date(dateTimeString).toLocaleString();
        } else if (order.orderTime) {
          // Fallback for old datetime format (for backwards compatibility)
          timestamp = new Date(order.orderTime).toLocaleString();
        }

        return {
          orderNumber: order.orderNo || 'FD0000',
          orderId: order.orderNo, // OrderNo is now the primary key (e.g., "FD0001")
          orderNo: order.orderNo,
          items: order.items?.map(item => {
          // Try to get item name from menuItem object first, then from map
          let itemName = 'Unknown Item';
          if (item.menuItem?.itemName) {
            itemName = item.menuItem.itemName;
          } else if (item.itemId && menuItemMap[item.itemId]) {
            itemName = menuItemMap[item.itemId];
          }

          return {
            name: itemName,
            quantity: item.itemCount || 0
          };
        }) || [],
        subtotal: parseFloat(order.subtotal || 0),
        tax: 0, // Calculate if needed
        tip: parseFloat(order.tip || 0),
        total: parseFloat(order.total || 0),
        timestamp: timestamp,
        deliveryAddress: order.address ?
          `${order.address.streetNo} ${order.address.streetName}, ${order.address.city}, ${order.address.state} ${order.address.zipCode}` :
          'No address',
        deliveryETA: order.deliveryETA || 0,
        status: order.deliveryStatus?.toLowerCase() || 'pending',
        // Use driver name from order record (stored directly) with fallback to driver object
        driver: (order.driverFirstname && order.driverLastname)
          ? `${order.driverFirstname} ${order.driverLastname}`
          : (order.driver ? `${order.driver.firstName} ${order.driver.lastName}` : null)
        };
      });

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to localStorage if backend fails
      const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
      setOrders(allOrders);
    }
  };

  const loadDrivers = async () => {
    try {
      // Only load drivers with status "Active" for assignment dropdown
      const response = await driverAPI.getAvailable();
      const backendDrivers = response.data;

      // Transform backend drivers to match frontend format
      const formattedDrivers = backendDrivers.map(driver => ({
        id: driver.driverId,
        firstName: driver.firstName,
        lastName: driver.lastName,
        username: driver.username
      }));

      setDrivers(formattedDrivers);
    } catch (error) {
      console.error('Error loading drivers:', error);
      // Fallback to localStorage if backend fails
      const driverList = JSON.parse(localStorage.getItem('driverList') || '[]');
      setDrivers(driverList);
    }
  };

  const loadAllDrivers = async () => {
    try {
      // Load ALL drivers (Active and Inactive) for display
      const response = await driverAPI.getAll();
      const backendDrivers = response.data;

      // Transform backend drivers to match frontend format
      const formattedDrivers = backendDrivers.map(driver => ({
        id: driver.driverId,
        firstName: driver.firstName,
        lastName: driver.lastName,
        username: driver.username,
        status: driver.status || 'Active',
        hiredDate: driver.hiredDate
      }));

      setAllDrivers(formattedDrivers);
    } catch (error) {
      console.error('Error loading all drivers:', error);
      // Fallback to localStorage if backend fails
      const driverList = JSON.parse(localStorage.getItem('driverList') || '[]');
      setAllDrivers(driverList);
    }
  };

  const loadCompletedOrders = async () => {
    try {
      // Fetch completed/delivered orders and menu items
      const [completedResponse, deliveredResponse, menuItemsResponse] = await Promise.all([
        ordersAPI.getByStatus('completed'),
        ordersAPI.getByStatus('delivered'),
        menuItemsAPI.getAll()
      ]);

      const completedBackendOrders = completedResponse.data;
      const deliveredBackendOrders = deliveredResponse.data;
      const menuItems = menuItemsResponse.data;

      // Combine both completed and delivered orders
      const allCompletedOrders = [...completedBackendOrders, ...deliveredBackendOrders];

      // Create a map of menu items by itemId for quick lookup
      const menuItemMap = {};
      menuItems.forEach(item => {
        menuItemMap[item.itemId] = item.itemName;
      });

      // Transform backend orders to match frontend format
      const formattedOrders = allCompletedOrders.map(order => {
        // Combine orderDate and orderTime into a single timestamp
        let timestamp = 'N/A';
        if (order.orderDate && order.orderTime) {
          const dateTimeString = `${order.orderDate}T${order.orderTime}`;
          timestamp = new Date(dateTimeString).toLocaleString();
        } else if (order.orderTime) {
          timestamp = new Date(order.orderTime).toLocaleString();
        }

        return {
          orderNumber: order.orderNo || 'FD0000',
          orderId: order.orderNo,
          orderNo: order.orderNo,
          items: order.items?.map(item => {
            let itemName = 'Unknown Item';
            if (item.menuItem?.itemName) {
              itemName = item.menuItem.itemName;
            } else if (item.itemId && menuItemMap[item.itemId]) {
              itemName = menuItemMap[item.itemId];
            }

            return {
              name: itemName,
              quantity: item.itemCount || 0
            };
          }) || [],
          subtotal: parseFloat(order.subtotal || 0),
          tax: 0,
          tip: parseFloat(order.tip || 0),
          total: parseFloat(order.total || 0),
          timestamp: timestamp,
          deliveryAddress: order.address ?
            `${order.address.streetNo} ${order.address.streetName}, ${order.address.city}, ${order.address.state} ${order.address.zipCode}` :
            'No address',
          deliveryETA: order.deliveryETA || 0,
          status: order.deliveryStatus?.toLowerCase() || 'completed',
          driver: (order.driverFirstname && order.driverLastname)
            ? `${order.driverFirstname} ${order.driverLastname}`
            : (order.driver ? `${order.driver.firstName} ${order.driver.lastName}` : 'N/A')
        };
      });

      // Sort by timestamp (most recent first)
      formattedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setCompletedOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading completed orders:', error);
      setCompletedOrders([]);
    }
  };

  const getAvailableDrivers = (currentOrderIndex) => {
    // Get drivers assigned to orders (excluding completed/delivered and the current order)
    const assignedDriverNames = orders
      .filter((order, index) =>
        order.driver &&
        order.status !== 'completed' &&
        order.status !== 'delivered' &&
        index !== currentOrderIndex
      )
      .map(order => order.driver);

    // Filter out assigned drivers from the driver list
    return drivers.filter(driver => {
      const fullName = `${driver.firstName} ${driver.lastName}`;
      return !assignedDriverNames.includes(fullName);
    });
  };

  const convertTo24Hour = (time12h) => {
    // Convert "6:10 PM" to "18:10:00"
    if (!time12h || !time12h.trim()) {
      return null;
    }

    try {
      const [time, modifier] = time12h.trim().split(' ');
      let [hours, minutes] = time.split(':');

      hours = parseInt(hours, 10);

      if (modifier.toUpperCase() === 'AM') {
        if (hours === 12) {
          hours = 0;
        }
      } else if (modifier.toUpperCase() === 'PM') {
        if (hours !== 12) {
          hours += 12;
        }
      }

      return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    } catch (error) {
      console.error('Error converting time:', error);
      return null;
    }
  };

  const handleDeliveryTimeChange = (orderIndex, time) => {
    setDeliveryTimes({
      ...deliveryTimes,
      [orderIndex]: time
    });
  };

  const handleAssignDriver = async (orderIndex, driverId) => {
    const order = orders[orderIndex];

    console.log('handleAssignDriver called with:', { orderIndex, driverId, order, orderId: order?.orderId });

    try {
      if (driverId === '') {
        // Unassign driver - update backend
        console.log('Unassigning driver for order:', order.orderId);
        await ordersAPI.assignDriver(order.orderId, null);
      } else {
        // Assign driver - update backend with driver ID (as integer)
        console.log('Assigning driver to order:', order.orderId, 'driverId:', parseInt(driverId));
        await ordersAPI.assignDriver(order.orderId, parseInt(driverId));
      }
      // Reload orders from backend
      loadOrders();
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver. Please try again.');
    }
  };

  const handleCompleteOrder = async (orderIndex) => {
    const order = orders[orderIndex];
    const deliveryTime = deliveryTimes[orderIndex];

    // Validate delivery time is provided
    if (!deliveryTime || !deliveryTime.trim()) {
      alert('Please enter a delivery time (e.g., 6:10 PM) before completing the order.');
      return;
    }

    // Convert to 24-hour format
    const time24 = convertTo24Hour(deliveryTime);
    if (!time24) {
      alert('Invalid time format. Please use format like "6:10 PM" or "2:30 AM"');
      return;
    }

    try {
      // First, update the order with delivery time and date
      await ordersAPI.update(order.orderId, {
        deliveryTime: time24,
        deliveryDate: new Date().toISOString().split('T')[0]
      });

      // Then complete the order
      await ordersAPI.completeOrder(order.orderId);

      // Clear the delivery time for this order
      const newDeliveryTimes = { ...deliveryTimes };
      delete newDeliveryTimes[orderIndex];
      setDeliveryTimes(newDeliveryTimes);

      // Reload orders from backend
      loadOrders();
      loadCompletedOrders();
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('requiresPasswordChange');
    navigate('/login');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <Header showLogin={false} />
      <main className="staff-content">
        <div className="staff-header">
          <h2 className="staff-title">Staff Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="orders-section">
          <h3 className="section-title">Order Management</h3>

          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders available at the moment.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={index} className="order-card">
                  <div className="order-header">
                    <div className="order-number">
                      <strong>{order.orderNumber}</strong>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="order-info-row">
                      <span className="label">Time:</span>
                      <span>{order.timestamp}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="label">Delivery Address:</span>
                      <span>{order.deliveryAddress}</span>
                    </div>
                    {order.deliveryETA && (
                      <div className="order-info-row">
                        <span className="label">Delivery ETA:</span>
                        <span>{order.deliveryETA} minutes</span>
                      </div>
                    )}
                    <div className="order-info-row">
                      <span className="label">Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="driver-assignment">
                    <label htmlFor={`driver-${index}`}>Assign Driver:</label>
                    <select
                      id={`driver-${index}`}
                      value={
                        order.driver
                          ? drivers.find(d => `${d.firstName} ${d.lastName}` === order.driver)?.id || ''
                          : ''
                      }
                      onChange={(e) => handleAssignDriver(index, e.target.value)}
                      disabled={order.status === 'completed' || order.status === 'delivered'}
                    >
                      <option value="">Select Driver</option>
                      {/* Show currently assigned driver first if exists */}
                      {order.driver && (
                        <option
                          key={`current-${index}`}
                          value={drivers.find(d => `${d.firstName} ${d.lastName}` === order.driver)?.id || ''}
                        >
                          {order.driver} (Current)
                        </option>
                      )}
                      {/* Show available drivers, excluding the currently assigned one */}
                      {getAvailableDrivers(index)
                        .filter(driver => `${driver.firstName} ${driver.lastName}` !== order.driver)
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.firstName} {driver.lastName}
                          </option>
                        ))
                      }
                    </select>

                    {order.status === 'pending' && order.driver && (
                      <div className="delivery-time-section">
                        <label htmlFor={`delivery-time-${index}`}>Delivery Time:</label>
                        <input
                          type="text"
                          id={`delivery-time-${index}`}
                          placeholder="e.g., 6:10 PM"
                          value={deliveryTimes[index] || ''}
                          onChange={(e) => handleDeliveryTimeChange(index, e.target.value)}
                        />
                        <button
                          className="complete-order-btn"
                          onClick={() => handleCompleteOrder(index)}
                        >
                          Complete Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drivers-section">
          <h3 className="section-title">Driver Status</h3>

          {allDrivers.length === 0 ? (
            <div className="no-drivers">
              <p>No drivers available.</p>
            </div>
          ) : (
            <>
              {allDrivers.filter(driver => driver.status === 'Active').length > 0 && (
                <div className="driver-list-section">
                  <h4 className="subsection-title">Active Drivers</h4>
                  <div className="driver-cards">
                    {allDrivers.filter(driver => driver.status === 'Active').map(driver => (
                      <div key={driver.id} className="driver-card active-driver">
                        <div className="driver-info">
                          <div className="driver-name">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="driver-details">
                            <span className="driver-id">ID: {driver.id}</span>
                            {driver.username && <span className="driver-username">Username: {driver.username}</span>}
                            {driver.hiredDate && <span className="driver-hired">Hired: {driver.hiredDate}</span>}
                          </div>
                        </div>
                        <div className="driver-status-badge status-active">Active</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allDrivers.filter(driver => driver.status === 'Inactive').length > 0 && (
                <div className="driver-list-section">
                  <h4 className="subsection-title">Inactive Drivers</h4>
                  <div className="driver-cards">
                    {allDrivers.filter(driver => driver.status === 'Inactive').map(driver => (
                      <div key={driver.id} className="driver-card inactive-driver">
                        <div className="driver-info">
                          <div className="driver-name">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="driver-details">
                            <span className="driver-id">ID: {driver.id}</span>
                            {driver.username && <span className="driver-username">Username: {driver.username}</span>}
                            {driver.hiredDate && <span className="driver-hired">Hired: {driver.hiredDate}</span>}
                          </div>
                        </div>
                        <div className="driver-status-badge status-inactive">Inactive</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="completed-orders-section">
          <h3 className="section-title">Completed Orders</h3>

          {completedOrders.length === 0 ? (
            <div className="no-completed-orders">
              <p>No completed orders yet.</p>
            </div>
          ) : (
            <div className="completed-orders-list">
              {completedOrders.map((order, index) => (
                <div key={index} className="order-card completed-order-card">
                  <div className="order-header">
                    <div className="order-number">
                      <strong>{order.orderNumber}</strong>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="order-info-row">
                      <span className="label">Time:</span>
                      <span>{order.timestamp}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="label">Delivery Address:</span>
                      <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="label">Driver:</span>
                      <span>{order.driver}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="label">Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
