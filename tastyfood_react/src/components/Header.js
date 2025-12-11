import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ showLogin = true }) => {
  return (
    <header className="header">
      <div className="logo-element">
        <div className="logo-circle-shape">TF</div>
        <h1 className="brand-name">TastyFood</h1>
      </div>
      <nav className="navigation">
        <Link to="/" className="menu-list">Menu</Link>
        <Link to="/rewards" className="rewards-list">Rewards</Link>
        {showLogin && <Link to="/login" className="login">Login</Link>}
      </nav>
    </header>
  );
};

export default Header;
