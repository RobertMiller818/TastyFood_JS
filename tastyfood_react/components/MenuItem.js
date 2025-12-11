import React from 'react';
import './MenuItem.css';

const MenuItem = ({ item, onQuantityChange }) => {
  return (
    <div className="menu-item">
      <div className="menu-item-info">
        <span className="item-name">{item.name}</span>
        <span className="item-spacing"></span>
        <span className="item-price">${item.price.toFixed(2)}</span>
      </div>
      <div className="quantity-controls">
        <button
          className="qty-btn minus"
          onClick={() => onQuantityChange(item.id, -1)}
        >
          -
        </button>
        <span className="quantity">{item.quantity}</span>
        <button
          className="qty-btn plus"
          onClick={() => onQuantityChange(item.id, 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
