import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import QuickActions from '../components/dashboard/QuickActions';
import './Dashboard.css';

const DashboardPage = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getPortfolio();
      console.log('Dashboard - fetched portfolio data:', data);
      setPortfolioData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatPercentage = (percentage) => {
    return `${(percentage || 0).toFixed(2)}%`;
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div className="error-message">{error}</div>;

  const summary = portfolioData?.summary || {};
  const investments = portfolioData?.investments || [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Portfolio Dashboard</h1>
        <p>Quick overview of your investment performance</p>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <h3>Total Invested</h3>
          <p className="card-value">{formatCurrency(summary.totalInvested)}</p>
        </div>
        <div className="overview-card">
          <h3>Current Value</h3>
          <p className="card-value">{formatCurrency(summary.totalCurrentValue)}</p>
        </div>
        <div className="overview-card">
          <h3>Total P&L</h3>
          <p className={`card-value ${summary.totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(summary.totalProfitLoss)}
          </p>
        </div>
        <div className="overview-card">
          <h3>P&L Percentage</h3>
          <p className={`card-value ${summary.totalProfitLossPercentage >= 0 ? 'positive' : 'negative'}`}>
            {formatPercentage(summary.totalProfitLossPercentage)}
          </p>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <PortfolioChart portfolioData={portfolioData} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default DashboardPage;
