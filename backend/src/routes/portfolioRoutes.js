const express = require('express');
const { Investment, User, Transaction } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/portfolio - Get user's complete portfolio with performance calculations
router.get('/', auth, async (req, res) => {
  try {
    const { sortBy = 'current_value', order = 'DESC', limit, offset = 0 } = req.query;
    
    // Validate sortBy parameter
    const allowedSortFields = ['name', 'symbol', 'type', 'quantity', 'purchase_price', 'current_value', 'purchase_date', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'current_value';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Build query options
    const queryOptions = {
      where: { user_id: req.user.userId },
      order: [[sortField, sortOrder]],
      offset: parseInt(offset) || 0,
    };

    if (limit) {
      queryOptions.limit = parseInt(limit);
    }

    const investments = await Investment.findAll(queryOptions);

    // Calculate performance metrics for each investment
    const portfolioData = investments.map(investment => {
      const totalInvested = investment.quantity * investment.purchase_price;
      const currentValue = investment.current_value;
      const profitLoss = currentValue - totalInvested;
      const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

      return {
        id: investment.id,
        name: investment.name,
        symbol: investment.symbol,
        type: investment.type,
        quantity: parseFloat(investment.quantity),
        purchasePrice: parseFloat(investment.purchase_price),
        currentValue: parseFloat(investment.current_value),
        purchaseDate: investment.purchase_date,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        currentPricePerUnit: investment.quantity > 0 ? parseFloat((currentValue / investment.quantity).toFixed(2)) : 0,
        createdAt: investment.created_at,
        updatedAt: investment.updated_at,
      };
    });

    // Calculate portfolio totals
    const portfolioSummary = portfolioData.reduce((acc, investment) => {
      acc.totalInvested += investment.totalInvested;
      acc.totalCurrentValue += investment.currentValue;
      acc.totalProfitLoss += investment.profitLoss;
      return acc;
    }, {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalProfitLoss: 0,
    });

    portfolioSummary.totalProfitLossPercentage = portfolioSummary.totalInvested > 0 
      ? parseFloat(((portfolioSummary.totalProfitLoss / portfolioSummary.totalInvested) * 100).toFixed(2))
      : 0;

    // Get total count for pagination
    const totalCount = await Investment.count({
      where: { user_id: req.user.userId }
    });

    res.json({
      investments: portfolioData,
      summary: {
        totalInvested: parseFloat(portfolioSummary.totalInvested.toFixed(2)),
        totalCurrentValue: parseFloat(portfolioSummary.totalCurrentValue.toFixed(2)),
        totalProfitLoss: parseFloat(portfolioSummary.totalProfitLoss.toFixed(2)),
        totalProfitLossPercentage: portfolioSummary.totalProfitLossPercentage,
        investmentCount: portfolioData.length,
        totalCount: totalCount,
      },
      pagination: {
        offset: parseInt(offset) || 0,
        limit: limit ? parseInt(limit) : null,
        totalCount: totalCount,
        hasMore: limit ? (parseInt(offset) + parseInt(limit)) < totalCount : false,
      }
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ 
      message: 'Server error fetching portfolio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get portfolio overview
router.get('/overview', auth, async (req, res) => {
  try {
    const investments = await Investment.findAll({
      where: { user_id: req.user.userId },
    });

    const portfolioStats = investments.reduce((acc, investment) => {
      const totalInvested = investment.quantity * investment.purchase_price;
      const currentValue = investment.current_value;
      const profitLoss = currentValue - totalInvested;

      acc.totalInvested += totalInvested;
      acc.currentValue += currentValue;
      acc.totalProfitLoss += profitLoss;

      return acc;
    }, {
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0,
    });

    portfolioStats.totalProfitLossPercentage = 
      portfolioStats.totalInvested > 0 
        ? (portfolioStats.totalProfitLoss / portfolioStats.totalInvested) * 100 
        : 0;

    res.json({
      ...portfolioStats,
      investmentCount: investments.length,
    });
  } catch (error) {
    console.error('Portfolio overview error:', error);
    res.status(500).json({ message: 'Server error fetching portfolio overview' });
  }
});

// Get portfolio allocation by type
router.get('/allocation', auth, async (req, res) => {
  try {
    const investments = await Investment.findAll({
      where: { user_id: req.user.userId },
    });

    const allocation = investments.reduce((acc, investment) => {
      const currentValue = investment.current_value;
      
      if (!acc[investment.type]) {
        acc[investment.type] = {
          type: investment.type,
          value: 0,
          count: 0,
        };
      }
      
      acc[investment.type].value += currentValue;
      acc[investment.type].count += 1;

      return acc;
    }, {});

    const totalValue = Object.values(allocation).reduce((sum, item) => sum + item.value, 0);

    // Calculate percentages
    Object.values(allocation).forEach(item => {
      item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    });

    res.json(Object.values(allocation));
  } catch (error) {
    console.error('Portfolio allocation error:', error);
    res.status(500).json({ message: 'Server error fetching portfolio allocation' });
  }
});

// GET /api/portfolio/performance - Get detailed performance metrics
router.get('/performance', auth, async (req, res) => {
  try {
    const { period = '1M' } = req.query; // 1D, 1W, 1M, 3M, 6M, 1Y, ALL
    
    const investments = await Investment.findAll({
      where: { user_id: req.user.userId },
    });

    const transactions = await Transaction.findAll({
      where: { user_id: req.user.userId },
      include: [
        {
          model: Investment,
          as: 'investment',
          attributes: ['name', 'symbol', 'type'],
        },
      ],
      order: [['date', 'ASC']],
    });

    // Calculate time-based performance
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1D':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date('1900-01-01'); // ALL time
    }

    const periodTransactions = transactions.filter(t => new Date(t.date) >= startDate);

    // Calculate portfolio metrics
    const portfolioMetrics = {
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      bestPerformer: null,
      worstPerformer: null,
      totalDividends: 0,
      totalFees: 0,
      transactionCount: periodTransactions.length,
      buyTransactions: periodTransactions.filter(t => t.type === 'buy').length,
      sellTransactions: periodTransactions.filter(t => t.type === 'sell').length,
    };

    const investmentPerformances = investments.map(investment => {
      const totalInvested = investment.quantity * investment.purchase_price;
      const currentValue = investment.current_value;
      const profitLoss = currentValue - totalInvested;
      const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

      portfolioMetrics.totalInvested += totalInvested;
      portfolioMetrics.currentValue += currentValue;
      portfolioMetrics.totalProfitLoss += profitLoss;

      const investmentTransactions = transactions.filter(t => t.investment_id === investment.id);
      const totalFees = investmentTransactions.reduce((sum, t) => sum + parseFloat(t.fees || 0), 0);
      portfolioMetrics.totalFees += totalFees;

      return {
        id: investment.id,
        symbol: investment.symbol,
        name: investment.name,
        type: investment.type,
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        transactionCount: investmentTransactions.length,
        fees: parseFloat(totalFees.toFixed(2)),
      };
    });

    // Calculate overall percentage
    portfolioMetrics.totalProfitLossPercentage = portfolioMetrics.totalInvested > 0 
      ? parseFloat(((portfolioMetrics.totalProfitLoss / portfolioMetrics.totalInvested) * 100).toFixed(2))
      : 0;

    // Find best and worst performers
    if (investmentPerformances.length > 0) {
      portfolioMetrics.bestPerformer = investmentPerformances.reduce((best, current) => 
        current.profitLossPercentage > best.profitLossPercentage ? current : best
      );
      
      portfolioMetrics.worstPerformer = investmentPerformances.reduce((worst, current) => 
        current.profitLossPercentage < worst.profitLossPercentage ? current : worst
      );
    }

    // Format final metrics
    Object.keys(portfolioMetrics).forEach(key => {
      if (typeof portfolioMetrics[key] === 'number' && !Number.isInteger(portfolioMetrics[key])) {
        portfolioMetrics[key] = parseFloat(portfolioMetrics[key].toFixed(2));
      }
    });

    res.json({
      success: true,
      period: period,
      startDate: startDate,
      endDate: now,
      portfolioMetrics: portfolioMetrics,
      investmentPerformances: investmentPerformances,
    });
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching portfolio performance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
