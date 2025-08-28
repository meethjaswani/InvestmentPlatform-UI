import React, { useState, useEffect } from 'react';
import { investmentService } from '../services/investmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Investments.css';

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    investmentType: 'stocks',
    purchaseDate: '',
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any existing errors
      const data = await investmentService.getAll();
      setInvestments(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load investments';
      setError(errorMessage);
      console.error('Investments fetch error:', err);
      setInvestments([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any existing errors
    
    try {
      if (editingId) {
        await investmentService.update(editingId, formData);
        setError(null); // Clear error on success
      } else {
        await investmentService.create(formData);
        setError(null); // Clear error on success
      }
      
      await fetchInvestments();
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save investment';
      setError(errorMessage);
      console.error('Save investment error:', err);
    }
  };

  const handleEdit = (investment) => {
    // Calculate current price per unit from total current value
    const currentPrice = investment.quantity > 0 
      ? (investment.current_value / investment.quantity) 
      : investment.purchase_price;

    setFormData({
      symbol: investment.symbol || '',
      name: investment.name || '',
      quantity: (investment.quantity || 0).toString(),
      purchasePrice: (investment.purchase_price || 0).toString(),
      currentPrice: (currentPrice || 0).toString(),
      investmentType: investment.type || 'stocks',
      purchaseDate: investment.purchase_date ? investment.purchase_date.split('T')[0] : '',
    });
    setEditingId(investment.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      setError(null); // Clear any existing errors
      
      try {
        await investmentService.delete(id);
        await fetchInvestments();
        setError(null); // Clear error on success
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete investment';
        setError(errorMessage);
        console.error('Delete investment error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
      investmentType: 'stocks',
      purchaseDate: '',
    });
    setEditingId(null);
    setShowAddForm(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <LoadingSpinner message="Loading investments..." />;

  return (
    <div className="investments">
      <div className="investments-header">
        <h1>My Investments</h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add Investment
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Investment' : 'Add New Investment'}</h2>
            <form onSubmit={handleSubmit} className="investment-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="symbol">Symbol</label>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., AAPL"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Apple Inc."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    step="0.000001"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    placeholder="Number of shares"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="investmentType">Type</label>
                  <select
                    id="investmentType"
                    name="investmentType"
                    value={formData.investmentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="stocks">Stocks</option>
                    <option value="bonds">Bonds</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="mutual_funds">Mutual Funds</option>
                    <option value="etf">ETF</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="purchasePrice">Purchase Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="purchasePrice"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    required
                    placeholder="Price per share"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPrice">Current Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="currentPrice"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleInputChange}
                    placeholder="Current market price (optional)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingId ? 'Update' : 'Add'} Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investments Table */}
      <div className="investments-table-container">
        {investments.length > 0 ? (
          <table className="investments-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Current Price</th>
                <th>Total Invested</th>
                <th>Current Value</th>
                <th>P&L</th>
                <th>P&L %</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => {
                // Calculate derived values
                const currentPricePerUnit = investment.quantity > 0 
                  ? investment.current_value / investment.quantity 
                  : investment.purchase_price;
                
                return (
                <tr key={investment.id}>
                  <td className="symbol">{investment.symbol || 'N/A'}</td>
                  <td>{investment.name || 'Unknown'}</td>
                  <td className="type">{(investment.type || '').replace(/_/g, ' ')}</td>
                  <td>{investment.quantity || 0}</td>
                  <td>{formatCurrency(investment.purchase_price || 0)}</td>
                  <td>{formatCurrency(currentPricePerUnit)}</td>
                  <td>{formatCurrency(investment.totalInvested || 0)}</td>
                  <td>{formatCurrency(investment.current_value || 0)}</td>
                  <td className={(investment.profitLoss || 0) >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(investment.profitLoss || 0)}
                  </td>
                  <td className={(investment.profitLossPercentage || 0) >= 0 ? 'positive' : 'negative'}>
                    {formatPercentage(investment.profitLossPercentage || 0)}
                  </td>
                  <td>{formatDate(investment.purchase_date)}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(investment)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(investment.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-investments">
            <h3>No investments found</h3>
            <p>Start building your portfolio by adding your first investment!</p>
            <button 
              className="add-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Investment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;
