const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Investment = sequelize.define('Investment', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  type: {
    type: DataTypes.ENUM('stocks', 'bonds', 'mutual_funds', 'etf', 'crypto'),
    allowNull: false,
    field: 'type',
  },
  purchase_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'purchase_price',
    validate: {
      min: 0,
    },
  },
  current_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'current_value',
    validate: {
      min: 0,
    },
  },
  quantity: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'purchase_date',
  },
  // Additional helpful fields
  symbol: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 10],
    },
  },
  // Virtual fields for calculations
  totalInvested: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.quantity * this.purchase_price;
    },
  },
  profitLoss: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.current_value - (this.quantity * this.purchase_price);
    },
  },
  profitLossPercentage: {
    type: DataTypes.VIRTUAL,
    get() {
      const invested = this.quantity * this.purchase_price;
      const current = this.current_value;
      return invested > 0 ? ((current - invested) / invested) * 100 : 0;
    },
  },
}, {
  tableName: 'investments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Investment;
