import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MenuItem from '../components/MenuItem';
import { menuItemsAPI } from '../services/api';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [rewardsNumber, setRewardsNumber] = useState('');
  const [rewardsApplied, setRewardsApplied] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0.20);
  const [customTipAmount, setCustomTipAmount] = useState('');

  // Fetch menu items from backend on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await menuItemsAPI.getAvailable();
        const items = response.data;

        // Transform backend data to match frontend format
        const formattedItems = {};
        items.forEach(item => {
          const itemId = item.itemId.toString();
          formattedItems[itemId] = {
            id: itemId,
            name: item.itemName,
            price: parseFloat(item.price),
            quantity: 0,
            category: item.category.toLowerCase()
          };
        });

        setMenuItems(formattedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error query menu items:', err);
        setError('Failed to load menu items. Using default menu.');
        // Fallback to hardcoded menu if backend is not available
        setMenuItems({
          '1': { id: '1', name: 'Tom Kha', price: 6.99, quantity: 0, category: 'appetizers' },
          '2': { id: '2', name: 'Tom Yum', price: 6.99, quantity: 0, category: 'appetizers' },
          '3': { id: '3', name: 'Satay', price: 8.99, quantity: 0, category: 'appetizers' },
          '4': { id: '4', name: 'Veggie Egg Rolls', price: 7.99, quantity: 0, category: 'appetizers' },
          '5': { id: '5', name: 'Pork Eggrolls', price: 8.99, quantity: 0, category: 'appetizers' },
          '6': { id: '6', name: 'Pad Thai', price: 17.99, quantity: 0, category: 'entrees' },
          '7': { id: '7', name: 'Khao Soi', price: 17.99, quantity: 0, category: 'entrees' },
          '8': { id: '8', name: 'Pad See Lew', price: 17.99, quantity: 0, category: 'entrees' },
          '9': { id: '9', name: 'Khao Pad', price: 16.99, quantity: 0, category: 'entrees' },
          '10': { id: '10', name: 'Thai Tea', price: 4.99, quantity: 0, category: 'beverages' },
          '11': { id: '11', name: 'Thai Coffee', price: 5.99, quantity: 0, category: 'beverages' },
          '12': { id: '12', name: 'Soft Drink', price: 3.99, quantity: 0, category: 'beverages' }
        });
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleQuantityChange = (itemId, change) => {
    setMenuItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: Math.max(0, prev[itemId].quantity + change)
      }
    }));
  };

  const getTotalItems = () => {
    return Object.values(menuItems).reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateSubtotal = () => {
    let subtotal = Object.values(menuItems).reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );
    if (rewardsApplied) {
      subtotal *= 0.9; // 10% discount
    }
    return subtotal;
  };

  const calculateTotals = () => {
    const subtotal = calculateSubtotal();
    const serviceCharge = subtotal * 0.0825;
    // Use custom tip amount if provided, otherwise use percentage-based tip
    const tip = customTipAmount !== '' && !isNaN(parseFloat(customTipAmount))
      ? parseFloat(customTipAmount)
      : subtotal * tipPercentage;
    const grandTotal = subtotal + serviceCharge + tip;
    return { subtotal, serviceCharge, tip, grandTotal };
  };

  const handleConfirmOrder = () => {
    const hasItems = Object.values(menuItems).some(item => item.quantity > 0);
    if (!hasItems) {
      alert('There are no items selected. Please select menu items. Then confirm your order.');
      return;
    }
    setShowOrderSummary(true);
  };

  const handleApplyRewards = () => {
    if (rewardsNumber.trim()) {
      setRewardsApplied(true);
      alert('Rewards applied! You received a 10% discount.');
    } else {
      alert('Please enter a rewards number.');
    }
  };

  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomTipAmount(value);
    }
  };

  const handleTipPercentageChange = (percentage) => {
    setTipPercentage(percentage);
    setCustomTipAmount(''); // Clear custom tip when selecting a percentage
  };

  const handleCheckout = () => {
    const totals = calculateTotals();
    localStorage.setItem('orderItems', JSON.stringify(menuItems));
    localStorage.setItem('orderTotals', JSON.stringify({
      subtotal: totals.subtotal,
      serviceCharge: totals.serviceCharge,
      tip: totals.tip,
      tipPercentage: tipPercentage,
      customTipAmount: customTipAmount,
      grandTotal: totals.grandTotal
    }));
    navigate('/checkout');
  };

  const getItemsByCategory = (category) => {
    return Object.values(menuItems).filter(item => item.category === category);
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="container">
        <Header />
        <main className="menu-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading menu...</p>
          </div>
        </main>
      </div>
    );
  }

  if (showOrderSummary) {
    return (
      <div className="container">
        <Header />
        <main className="menu-content">
          <section className="order-summary">
            <h2>Order Confirmation</h2>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price Per Item</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(menuItems)
                  .filter(item => item.quantity > 0)
                  .map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="order-totals">
              <div className="rewards-section">
                <label htmlFor="rewardsNumber">Rewards Number</label>
                <input
                  type="text"
                  id="rewardsNumber"
                  placeholder="Enter Rewards Number"
                  value={rewardsNumber}
                  onChange={(e) => setRewardsNumber(e.target.value)}
                />
                <button className="apply-rewards-btn" onClick={handleApplyRewards}>
                  Apply Rewards
                </button>
                <p className="rewards-info">
                  Applying rewards could reduce subtotal by 10% if applicable
                </p>
              </div>
              <div className="totals-explanation">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Service Charge 8.25%</span>
                  <span>${totals.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="tip-selection">
                  <label htmlFor="tipPercentage">Select Tip:</label>
                  <div className="tip-buttons">
                    <button
                      type="button"
                      className={tipPercentage === 0.15 && !customTipAmount ? 'tip-btn active' : 'tip-btn'}
                      onClick={() => handleTipPercentageChange(0.15)}
                    >
                      15%
                    </button>
                    <button
                      type="button"
                      className={tipPercentage === 0.18 && !customTipAmount ? 'tip-btn active' : 'tip-btn'}
                      onClick={() => handleTipPercentageChange(0.18)}
                    >
                      18%
                    </button>
                    <button
                      type="button"
                      className={tipPercentage === 0.20 && !customTipAmount ? 'tip-btn active' : 'tip-btn'}
                      onClick={() => handleTipPercentageChange(0.20)}
                    >
                      20%
                    </button>
                    <button
                      type="button"
                      className={tipPercentage === 0.25 && !customTipAmount ? 'tip-btn active' : 'tip-btn'}
                      onClick={() => handleTipPercentageChange(0.25)}
                    >
                      25%
                    </button>
                  </div>
                  <div className="custom-tip-section">
                    <label htmlFor="customTip">Or enter custom tip amount:</label>
                    <div className="custom-tip-input-wrapper">
                      <span className="dollar-sign">$</span>
                      <input
                        type="text"
                        id="customTip"
                        placeholder="0.00"
                        value={customTipAmount}
                        onChange={handleCustomTipChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="total-line">
                  <span>Tip ({customTipAmount !== '' && !isNaN(parseFloat(customTipAmount)) ? 'Custom' : (tipPercentage * 100).toFixed(0) + '%'})</span>
                  <span>${totals.tip.toFixed(2)}</span>
                </div>
                <div className="total-line grand-total">
                  <span>Grand Total</span>
                  <span>${totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Order Checkout
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <main className="menu-content">
        <section className="menu-sections">
          <div className="menu-category">
            <h2 className="menu-category-title">Appetizers</h2>
            <div className="menu-items">
              {getItemsByCategory('appetizers').map(item => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>

          <div className="menu-category">
            <h2 className="menu-category-title">Entrees</h2>
            <div className="menu-items">
              {getItemsByCategory('entrees').map(item => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>

          <div className="menu-category">
            <h2 className="menu-category-title">Beverages</h2>
            <div className="menu-items">
              {getItemsByCategory('beverages').map(item => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>
        </section>
        <button
          className="confirm-order-btn"
          onClick={handleConfirmOrder}
        >
          {getTotalItems() > 0 ? `Confirm Order (${getTotalItems()} items)` : 'Confirm Order'}
        </button>
      </main>
    </div>
  );
};

export default Menu;
