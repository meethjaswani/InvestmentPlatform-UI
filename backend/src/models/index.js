const User = require('./User');
const Investment = require('./Investment');
const Transaction = require('./Transaction');

// Define associations

// User associations
User.hasMany(Investment, {
  foreignKey: 'user_id',
  as: 'investments',
  onDelete: 'CASCADE',
});

User.hasMany(Transaction, {
  foreignKey: 'user_id',
  as: 'transactions',
  onDelete: 'CASCADE',
});

// Investment associations
Investment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Investment.hasMany(Transaction, {
  foreignKey: 'investment_id',
  as: 'transactions',
  onDelete: 'CASCADE',
});

// Transaction associations
Transaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Transaction.belongsTo(Investment, {
  foreignKey: 'investment_id',
  as: 'investment',
});

module.exports = {
  User,
  Investment,
  Transaction,
};
