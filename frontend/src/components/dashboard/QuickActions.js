import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = () => {
  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        <Link to="/investments" className="action-card">
          <div className="action-icon">📈</div>
          <div className="action-content">
            <h4>Add Investment</h4>
            <p>Add new stocks, bonds, or other investments to your portfolio</p>
          </div>
        </Link>
        
        <Link to="/portfolio" className="action-card">
          <div className="action-icon">💼</div>
          <div className="action-content">
            <h4>View Portfolio</h4>
            <p>See detailed analysis and asset allocation</p>
          </div>
        </Link>
        
        <Link to="/investments" className="action-card">
          <div className="action-icon">📊</div>
          <div className="action-content">
            <h4>Manage Investments</h4>
            <p>View, edit, and manage all your investments</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
