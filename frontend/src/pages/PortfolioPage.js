import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Portfolio.css';

const PortfolioPage = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [portfolioResponse, allocationData] = await Promise.all([
        portfolioService.getPortfolio(),
        portfolioService.getAllocation(),
      ]);

      setPortfolioData(portfolioResponse);
      setAllocation(allocationData);
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error('Portfolio fetch error:', err);
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

  if (loading) return <LoadingSpinner message="Loading portfolio..." />;
  if (error) return <div className="error-message">{error}</div>;

  const summary = portfolioData?.summary || {};

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <div className="header-content">
          <h1>Portfolio Overview</h1>
          <p>Comprehensive view of your investment portfolio</p>
        </div>
        <div className="header-actions">
          <a href="/dashboard" className="back-btn">
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card large">
          <h2>Portfolio Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <label>Total Invested</label>
              <span className="value">{formatCurrency(summary.totalInvested)}</span>
            </div>
            <div className="metric">
              <label>Current Value</label>
              <span className="value">{formatCurrency(summary.totalCurrentValue)}</span>
            </div>
            <div className="metric">
              <label>Total Profit/Loss</label>
              <span className={`value ${summary.totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.totalProfitLoss)}
              </span>
            </div>
            <div className="metric">
              <label>Return Percentage</label>
              <span className={`value ${summary.totalProfitLossPercentage >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(summary.totalProfitLossPercentage)}
              </span>
            </div>
            <div className="metric">
              <label>Total Investments</label>
              <span className="value">{summary.investmentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="portfolio-section">
        <h2>Asset Allocation</h2>
        {allocation.length > 0 ? (
          <div className="allocation-grid">
            {allocation.map((item, index) => (
              <div key={index} className="allocation-card">
                <div className="allocation-header">
                  <h3>{item.type.charAt(0).toUpperCase() + item.type.slice(1).replace(/_/g, ' ')}</h3>
                  <span className="allocation-count">{item.count} investments</span>
                </div>
                <div className="allocation-value">
                  {formatCurrency(item.value)}
                </div>
                <div className="allocation-percentage">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No allocation data available</p>
        )}
      </div>

      {/* Individual Investments */}
      <div className="portfolio-section">
        <h2>Individual Investments</h2>
        {portfolioData?.investments && portfolioData.investments.length > 0 ? (
          <div className="investments-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Value</th>
                  <th>P&L</th>
                  <th>P&L %</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="symbol">{investment.symbol}</td>
                    <td className="name">{investment.name}</td>
                    <td className="type">{investment.type}</td>
                    <td className="quantity">{investment.quantity}</td>
                    <td className="purchase-price">{formatCurrency(investment.purchasePrice)}</td>
                    <td className="current-value">{formatCurrency(investment.currentValue)}</td>
                    <td className={`profit-loss ${investment.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(investment.profitLoss)}
                    </td>
                    <td className={`profit-loss-percentage ${investment.profitLossPercentage >= 0 ? 'positive' : 'negative'}`}>
                      {formatPercentage(investment.profitLossPercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No investments found</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;