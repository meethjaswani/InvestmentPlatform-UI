const express = require('express');
const { Transaction, Investment } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Input validation middleware for transactions
const validateTransactionInput = (req, res, next) => {
  const { investment_id, type, amount, price, date, fees } = req.body;
  const errors = [];

  if (!investment_id || isNaN(parseInt(investment_id))) {
    errors.push({ field: 'investment_id', message: 'Valid investment ID is required' });
  }

  if (!type || !['buy', 'sell'].includes(type)) {
    errors.push({ field: 'type', message: 'Transaction type must be either "buy" or "sell"' });
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be a positive number' });
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push({ field: 'price', message: 'Price must be a positive number' });
  }

  if (date && isNaN(Date.parse(date))) {
    errors.push({ field: 'date', message: 'Invalid date format' });
  }

  if (fees !== undefined && (isNaN(fees) || parseFloat(fees) < 0)) {
    errors.push({ field: 'fees', message: 'Fees must be a non-negative number' });
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

// GET /api/transactions - Get all transactions for user with enhanced filtering
router.get('/', auth, async (req, res) => {
  try {
    const { 
      type, 
      investment_id, 
      limit, 
      offset = 0, 
      sortBy = 'date', 
      order = 'DESC',
      startDate,
      endDate 
    } = req.query;

    // Build where clause
    const whereClause = { user_id: req.user.userId };

    if (type && ['buy', 'sell'].includes(type)) {
      whereClause.type = type;
    }

    if (investment_id && !isNaN(parseInt(investment_id))) {
      whereClause.investment_id = parseInt(investment_id);
    }

    if (startDate && !isNaN(Date.parse(startDate))) {
      whereClause.date = { ...whereClause.date, [Op.gte]: new Date(startDate) };
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      whereClause.date = { ...whereClause.date, [Op.lte]: new Date(endDate) };
    }

    // Validate sortBy parameter
    const allowedSortFields = ['date', 'type', 'amount', 'price', 'fees'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Build query options
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Investment,
          as: 'investment',
          attributes: ['id', 'name', 'symbol', 'type'],
        },
      ],
      order: [[sortField, sortOrder]],
      offset: parseInt(offset) || 0,
    };

    if (limit) {
      queryOptions.limit = parseInt(limit);
    }

    const transactions = await Transaction.findAll(queryOptions);

    // Calculate additional metrics for each transaction
    const transactionsWithMetrics = transactions.map(transaction => ({
      id: transaction.id,
      investmentId: transaction.investment_id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      price: parseFloat(transaction.price),
      totalValue: parseFloat((transaction.amount * transaction.price).toFixed(2)),
      fees: parseFloat(transaction.fees || 0),
      netValue: parseFloat(((transaction.amount * transaction.price) - (transaction.fees || 0)).toFixed(2)),
      date: transaction.date,
      notes: transaction.notes,
      investment: transaction.investment,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    }));

    // Get total count for pagination
    const totalCount = await Transaction.count({ where: whereClause });

    res.json({
      success: true,
      transactions: transactionsWithMetrics,
      pagination: {
        offset: parseInt(offset) || 0,
        limit: limit ? parseInt(limit) : null,
        totalCount: totalCount,
        hasMore: limit ? (parseInt(offset) + parseInt(limit)) < totalCount : false,
      }
    });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get transactions for specific investment
router.get('/investment/:investmentId', auth, async (req, res) => {
  try {
    const { investmentId } = req.params;

    // Verify investment belongs to user
    const investment = await Investment.findOne({
      where: { id: investmentId, user_id: req.user.userId },
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    const transactions = await Transaction.findAll({
      where: { 
        investment_id: investmentId,
        user_id: req.user.userId,
      },
      order: [['date', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    console.error('Fetch investment transactions error:', error);
    res.status(500).json({ message: 'Server error fetching investment transactions' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', auth, validateTransactionInput, async (req, res) => {
  try {
    const {
      investment_id,
      type,
      amount,
      price,
      date,
      fees,
      notes,
    } = req.body;

    // Verify investment belongs to user
    const investment = await Investment.findOne({
      where: { id: parseInt(investment_id), user_id: req.user.userId },
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Additional validation for sell transactions
    if (type === 'sell') {
      if (parseFloat(amount) > parseFloat(investment.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Cannot sell ${amount} shares. You only own ${investment.quantity} shares.`,
          availableQuantity: parseFloat(investment.quantity)
        });
      }
    }

    const transaction = await Transaction.create({
      user_id: req.user.userId,
      investment_id: parseInt(investment_id),
      type,
      amount: parseFloat(amount),
      price: parseFloat(price),
      date: date ? new Date(date) : new Date(),
      fees: parseFloat(fees || 0),
      notes: notes ? notes.trim() : null,
    });

    // Update investment based on transaction
    await updateInvestmentFromTransaction(investment, transaction);

    const transactionWithInvestment = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Investment,
          as: 'investment',
          attributes: ['id', 'name', 'symbol', 'type'],
        },
      ],
    });

    // Calculate metrics for response
    const totalValue = transaction.amount * transaction.price;
    const netValue = totalValue - transaction.fees;

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction: {
        id: transaction.id,
        investmentId: transaction.investment_id,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        price: parseFloat(transaction.price),
        totalValue: parseFloat(totalValue.toFixed(2)),
        fees: parseFloat(transaction.fees),
        netValue: parseFloat(netValue.toFixed(2)),
        date: transaction.date,
        notes: transaction.notes,
        investment: transactionWithInvestment.investment,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    
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
      message: 'Server error creating transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const transaction = await Transaction.findOne({
      where: { id, user_id: req.user.userId },
      include: [
        {
          model: Investment,
          as: 'investment',
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update(updates);
    
    // Update investment based on new transaction values
    await updateInvestmentFromTransaction(transaction.investment, transaction);

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error updating transaction' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, user_id: req.user.userId },
      include: [
        {
          model: Investment,
          as: 'investment',
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();

    // Recalculate investment values after deletion
    await recalculateInvestmentFromTransactions(transaction.investment);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error deleting transaction' });
  }
});

// Helper function to update investment based on transaction
const updateInvestmentFromTransaction = async (investment, transaction) => {
  try {
    // For simplicity, we'll update the investment's current values
    // In a real app, you might want to recalculate from all transactions
    
    if (transaction.type === 'buy') {
      // Update quantity and recalculate current_value
      const newQuantity = parseFloat(investment.quantity) + parseFloat(transaction.amount);
      await investment.update({
        quantity: newQuantity,
        current_value: newQuantity * transaction.price, // Using transaction price as current
      });
    } else if (transaction.type === 'sell') {
      // Reduce quantity
      const newQuantity = parseFloat(investment.quantity) - parseFloat(transaction.amount);
      if (newQuantity < 0) {
        throw new Error('Cannot sell more than owned quantity');
      }
      await investment.update({
        quantity: newQuantity,
        current_value: newQuantity * transaction.price,
      });
    }
  } catch (error) {
    console.error('Error updating investment from transaction:', error);
    throw error;
  }
};

// Helper function to recalculate investment from all transactions
const recalculateInvestmentFromTransactions = async (investment) => {
  try {
    const transactions = await Transaction.findAll({
      where: { investment_id: investment.id },
      order: [['date', 'ASC']],
    });

    let totalQuantity = 0;
    let totalValue = 0;
    let lastPrice = investment.purchase_price;

    transactions.forEach(transaction => {
      if (transaction.type === 'buy') {
        totalQuantity += parseFloat(transaction.amount);
        lastPrice = transaction.price;
      } else if (transaction.type === 'sell') {
        totalQuantity -= parseFloat(transaction.amount);
        lastPrice = transaction.price;
      }
    });

    totalValue = totalQuantity * lastPrice;

    await investment.update({
      quantity: totalQuantity,
      current_value: totalValue,
    });
  } catch (error) {
    console.error('Error recalculating investment:', error);
    throw error;
  }
};

module.exports = router;
