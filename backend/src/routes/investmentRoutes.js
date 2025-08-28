const express = require('express');
const { Investment } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Input validation middleware
const validateInvestmentInput = (req, res, next) => {
  const { symbol, name, quantity, purchasePrice, currentPrice, investmentType, purchaseDate } = req.body;
  const errors = [];

  if (!symbol || symbol.trim().length === 0) {
    errors.push({ field: 'symbol', message: 'Symbol is required' });
  } else if (symbol.length > 10) {
    errors.push({ field: 'symbol', message: 'Symbol must be 10 characters or less' });
  }

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Investment name is required' });
  } else if (name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or less' });
  }

  if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive number' });
  }

  if (!purchasePrice || isNaN(purchasePrice) || parseFloat(purchasePrice) <= 0) {
    errors.push({ field: 'purchasePrice', message: 'Purchase price must be a positive number' });
  }

  if (currentPrice !== undefined && (isNaN(currentPrice) || parseFloat(currentPrice) < 0)) {
    errors.push({ field: 'currentPrice', message: 'Current price must be a non-negative number' });
  }

  const validTypes = ['stocks', 'bonds', 'mutual_funds', 'etf', 'crypto'];
  if (!investmentType || !validTypes.includes(investmentType)) {
    errors.push({ field: 'investmentType', message: `Investment type must be one of: ${validTypes.join(', ')}` });
  }

  if (!purchaseDate || isNaN(Date.parse(purchaseDate))) {
    errors.push({ field: 'purchaseDate', message: 'Valid purchase date is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Get all investments for user
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']],
    });

    res.json(investments);
  } catch (error) {
    console.error('Fetch investments error:', error);
    res.status(500).json({ message: 'Server error fetching investments' });
  }
});

// POST /api/investments - Create new investment
router.post('/', auth, validateInvestmentInput, async (req, res) => {
  try {
    const {
      symbol,
      name,
      quantity,
      purchasePrice,
      currentPrice,
      investmentType,
      purchaseDate,
    } = req.body;

    // Check for duplicate investment (same symbol for same user)
    const existingInvestment = await Investment.findOne({
      where: { 
        user_id: req.user.userId,
        symbol: symbol.toUpperCase().trim()
      }
    });

    if (existingInvestment) {
      return res.status(409).json({
        success: false,
        message: 'Investment with this symbol already exists in your portfolio'
      });
    }

    const investment = await Investment.create({
      user_id: req.user.userId,
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      quantity: parseFloat(quantity),
      purchase_price: parseFloat(purchasePrice),
      current_value: parseFloat(currentPrice || purchasePrice) * parseFloat(quantity),
      type: investmentType,
      purchase_date: new Date(purchaseDate),
    });

    // Calculate performance metrics for response
    const totalInvested = investment.quantity * investment.purchase_price;
    const profitLoss = investment.current_value - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      investment: {
        id: investment.id,
        symbol: investment.symbol,
        name: investment.name,
        type: investment.type,
        quantity: parseFloat(investment.quantity),
        purchasePrice: parseFloat(investment.purchase_price),
        currentValue: parseFloat(investment.current_value),
        purchaseDate: investment.purchase_date,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        createdAt: investment.created_at,
        updatedAt: investment.updated_at,
      }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error creating investment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/investments/:id - Update existing investment
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investment ID'
      });
    }

    const investment = await Investment.findOne({
      where: { id: parseInt(id), user_id: req.user.userId },
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Validate updates
    const errors = [];
    
    if (updates.symbol !== undefined) {
      if (!updates.symbol || updates.symbol.trim().length === 0) {
        errors.push({ field: 'symbol', message: 'Symbol cannot be empty' });
      } else if (updates.symbol.length > 10) {
        errors.push({ field: 'symbol', message: 'Symbol must be 10 characters or less' });
      }
    }

    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Name cannot be empty' });
      } else if (updates.name.length > 100) {
        errors.push({ field: 'name', message: 'Name must be 100 characters or less' });
      }
    }

    if (updates.quantity !== undefined && (isNaN(updates.quantity) || parseFloat(updates.quantity) <= 0)) {
      errors.push({ field: 'quantity', message: 'Quantity must be a positive number' });
    }

    if (updates.purchasePrice !== undefined && (isNaN(updates.purchasePrice) || parseFloat(updates.purchasePrice) <= 0)) {
      errors.push({ field: 'purchasePrice', message: 'Purchase price must be a positive number' });
    }

    if (updates.currentPrice !== undefined && (isNaN(updates.currentPrice) || parseFloat(updates.currentPrice) < 0)) {
      errors.push({ field: 'currentPrice', message: 'Current price must be a non-negative number' });
    }

    if (updates.investmentType !== undefined) {
      const validTypes = ['stocks', 'bonds', 'mutual_funds', 'etf', 'crypto'];
      if (!validTypes.includes(updates.investmentType)) {
        errors.push({ field: 'investmentType', message: `Investment type must be one of: ${validTypes.join(', ')}` });
      }
    }

    if (updates.purchaseDate !== undefined && isNaN(Date.parse(updates.purchaseDate))) {
      errors.push({ field: 'purchaseDate', message: 'Invalid purchase date' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Map frontend field names to database field names
    const dbUpdates = {};
    if (updates.purchasePrice !== undefined) dbUpdates.purchase_price = parseFloat(updates.purchasePrice);
    if (updates.investmentType !== undefined) dbUpdates.type = updates.investmentType;
    if (updates.purchaseDate !== undefined) dbUpdates.purchase_date = new Date(updates.purchaseDate);
    if (updates.symbol !== undefined) dbUpdates.symbol = updates.symbol.toUpperCase().trim();
    if (updates.name !== undefined) dbUpdates.name = updates.name.trim();

    // Handle quantity and current price updates
    let newQuantity = updates.quantity !== undefined ? parseFloat(updates.quantity) : investment.quantity;
    let newCurrentPrice = updates.currentPrice !== undefined ? parseFloat(updates.currentPrice) : 
                          (investment.quantity > 0 ? investment.current_value / investment.quantity : investment.purchase_price);

    if (updates.quantity !== undefined) dbUpdates.quantity = newQuantity;
    if (updates.currentPrice !== undefined || updates.quantity !== undefined) {
      dbUpdates.current_value = newQuantity * newCurrentPrice;
    }

    await investment.update(dbUpdates);
    
    // Reload investment to get updated values
    await investment.reload();

    // Calculate performance metrics for response
    const totalInvested = investment.quantity * investment.purchase_price;
    const profitLoss = investment.current_value - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    res.json({
      success: true,
      message: 'Investment updated successfully',
      investment: {
        id: investment.id,
        symbol: investment.symbol,
        name: investment.name,
        type: investment.type,
        quantity: parseFloat(investment.quantity),
        purchasePrice: parseFloat(investment.purchase_price),
        currentValue: parseFloat(investment.current_value),
        purchaseDate: investment.purchase_date,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        createdAt: investment.created_at,
        updatedAt: investment.updated_at,
      }
    });
  } catch (error) {
    console.error('Update investment error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating investment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/investments/:id - Delete investment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investment ID'
      });
    }

    const investment = await Investment.findOne({
      where: { id: parseInt(id), user_id: req.user.userId },
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Store investment details for response
    const deletedInvestment = {
      id: investment.id,
      symbol: investment.symbol,
      name: investment.name,
      type: investment.type,
    };

    await investment.destroy();
    
    res.json({
      success: true,
      message: 'Investment deleted successfully',
      deletedInvestment: deletedInvestment
    });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting investment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific investment
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findOne({
      where: { id, user_id: req.user.userId },
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json(investment);
  } catch (error) {
    console.error('Fetch investment error:', error);
    res.status(500).json({ message: 'Server error fetching investment' });
  }
});

module.exports = router;
