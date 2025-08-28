const { Sequelize } = require('sequelize');
const path = require('path');

// Ensure database directory exists
const fs = require('fs');
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/investment_platform.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Database initialization function
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Import models to register them
    require('../models');
    
    // Sync database (create tables)
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    return false;
  }
};

// Function to reset database (useful for development)
const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database reset successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to reset database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  resetDatabase,
};
