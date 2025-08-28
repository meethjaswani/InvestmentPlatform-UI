import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ToggleSwitch from './ToggleSwitch';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <h2>Investment Platform</h2>
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="navbar-menu">
        <Link 
          to="/dashboard" 
          className={`navbar-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/portfolio" 
          className={`navbar-item ${isActive('/portfolio') ? 'active' : ''}`}
        >
          Portfolio
        </Link>
        <Link 
          to="/investments" 
          className={`navbar-item ${isActive('/investments') ? 'active' : ''}`}
        >
          Investments
        </Link>
      </div>

      {/* Desktop User Menu */}
      <div className="navbar-user">
        <ToggleSwitch
          isOn={isDarkMode}
          onToggle={toggleTheme}
          iconOn="🌞"
          iconOff="🌙"
          label={isDarkMode ? 'Light' : 'Dark'}
        />
        <span className="welcome-text">Welcome, {user?.firstName}!</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-menu">
                      <Link 
              to="/dashboard" 
              className={`navbar-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/portfolio" 
              className={`navbar-item ${isActive('/portfolio') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Portfolio
            </Link>
            <Link 
              to="/investments" 
              className={`navbar-item ${isActive('/investments') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Investments
            </Link>
        </div>
        
        <div className="navbar-user">
          <ToggleSwitch
            isOn={isDarkMode}
            onToggle={toggleTheme}
            iconOn="🌞"
            iconOff="🌙"
            label={isDarkMode ? 'Light' : 'Dark'}
          />
          <span className="welcome-text">Welcome, {user?.firstName}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
