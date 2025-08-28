const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  investment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'investment_id',
    references: {
      model: 'investments',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
    field: 'type',
  },
  amount: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: false,
    validate: {
      min: 0,
    },
    comment: 'Quantity of shares/units bought or sold',
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
    comment: 'Price per share/unit at the time of transaction',
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Virtual field for total transaction value
  totalValue: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.amount * this.price;
    },
  },
  // Additional fields for better tracking
  fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0,
    },
    comment: 'Transaction fees charged',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes about the transaction',
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['investment_id'],
    },
    {
      fields: ['date'],
    },
    {
      fields: ['type'],
    },
  ],
});

module.exports = Transaction;
