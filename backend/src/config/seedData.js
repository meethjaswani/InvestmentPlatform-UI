const { User, Investment, Transaction } = require('../models');

const seedUsers = [
  {
    email: 'john.doe@example.com',
    password_hash: 'password123', // Will be hashed automatically
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    email: 'jane.smith@example.com',
    password_hash: 'password123',
    username: 'janesmith',
    firstName: 'Jane',
    lastName: 'Smith',
  },
  {
    email: 'investor@example.com',
    password_hash: 'password123',
    username: 'investor',
    firstName: 'Smart',
    lastName: 'Investor',
  },
];

const seedInvestments = [
  // John's investments
  {
    user_id: 1,
    name: 'Apple Inc.',
    symbol: 'AAPL',
    type: 'stocks',
    purchase_price: 150.00,
    current_value: 3200.00, // Total current value for 20 shares
    quantity: 20.000000,
    purchase_date: new Date('2023-01-15'),
  },
  {
    user_id: 1,
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    type: 'stocks',
    purchase_price: 280.00,
    current_value: 1650.00, // Total current value for 5 shares
    quantity: 5.000000,
    purchase_date: new Date('2023-02-20'),
  },
  {
    user_id: 1,
    name: 'US Treasury Bond 10Y',
    symbol: 'US10Y',
    type: 'bonds',
    purchase_price: 1000.00,
    current_value: 1020.00,
    quantity: 1.000000,
    purchase_date: new Date('2023-03-10'),
  },
  
  // Jane's investments
  {
    user_id: 2,
    name: 'Vanguard S&P 500 ETF',
    symbol: 'VOO',
    type: 'etf',
    purchase_price: 350.00,
    current_value: 3800.00, // Total current value for 10 shares
    quantity: 10.000000,
    purchase_date: new Date('2023-01-25'),
  },
  {
    user_id: 2,
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    purchase_price: 45000.00,
    current_value: 43000.00, // Total current value for 1 BTC
    quantity: 1.000000,
    purchase_date: new Date('2023-04-01'),
  },
  {
    user_id: 2,
    name: 'Fidelity Blue Chip Growth Fund',
    symbol: 'FBGRX',
    type: 'mutual_funds',
    purchase_price: 50.00,
    current_value: 5300.00, // Total current value for 100 shares
    quantity: 100.000000,
    purchase_date: new Date('2023-02-15'),
  },
  
  // Smart Investor's investments
  {
    user_id: 3,
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    type: 'stocks',
    purchase_price: 200.00,
    current_value: 1250.00, // Total current value for 5 shares
    quantity: 5.000000,
    purchase_date: new Date('2023-03-01'),
  },
  {
    user_id: 3,
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    purchase_price: 1800.00,
    current_value: 3600.00, // Total current value for 2 ETH
    quantity: 2.000000,
    purchase_date: new Date('2023-03-15'),
  },
];

const seedTransactions = [
  // John's transactions
  {
    user_id: 1,
    investment_id: 1, // AAPL
    type: 'buy',
    amount: 20.000000,
    price: 150.00,
    date: new Date('2023-01-15'),
    fees: 5.00,
    notes: 'Initial purchase of Apple shares',
  },
  {
    user_id: 1,
    investment_id: 2, // MSFT
    type: 'buy',
    amount: 10.000000,
    price: 280.00,
    date: new Date('2023-02-20'),
    fees: 7.50,
    notes: 'Initial purchase of Microsoft shares',
  },
  {
    user_id: 1,
    investment_id: 2, // MSFT - partial sell
    type: 'sell',
    amount: 5.000000,
    price: 320.00,
    date: new Date('2023-11-15'),
    fees: 7.50,
    notes: 'Sold half of Microsoft position for profit taking',
  },
  
  // Jane's transactions
  {
    user_id: 2,
    investment_id: 4, // VOO
    type: 'buy',
    amount: 10.000000,
    price: 350.00,
    date: new Date('2023-01-25'),
    fees: 0.00,
    notes: 'ETF purchase - no fees',
  },
  {
    user_id: 2,
    investment_id: 5, // BTC
    type: 'buy',
    amount: 1.000000,
    price: 45000.00,
    date: new Date('2023-04-01'),
    fees: 50.00,
    notes: 'Bitcoin purchase with exchange fees',
  },
  
  // Smart Investor's transactions
  {
    user_id: 3,
    investment_id: 7, // TSLA
    type: 'buy',
    amount: 5.000000,
    price: 200.00,
    date: new Date('2023-03-01'),
    fees: 5.00,
    notes: 'Tesla investment for portfolio diversification',
  },
  {
    user_id: 3,
    investment_id: 8, // ETH
    type: 'buy',
    amount: 2.000000,
    price: 1800.00,
    date: new Date('2023-03-15'),
    fees: 25.00,
    notes: 'Ethereum purchase for crypto exposure',
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Transaction.destroy({ where: {}, force: true });
    await Investment.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    
    console.log('📝 Creating users...');
    const users = await User.bulkCreate(seedUsers, { 
      individualHooks: true, // This ensures password hashing runs
      returning: true 
    });
    console.log(`✅ Created ${users.length} users`);
    
    console.log('💼 Creating investments...');
    const investments = await Investment.bulkCreate(seedInvestments, { returning: true });
    console.log(`✅ Created ${investments.length} investments`);
    
    console.log('💰 Creating transactions...');
    const transactions = await Transaction.bulkCreate(seedTransactions, { returning: true });
    console.log(`✅ Created ${transactions.length} transactions`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Print summary
    console.log('\n📊 Database Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Investments: ${investments.length}`);
    console.log(`Transactions: ${transactions.length}`);
    
    console.log('\n👥 Test Users:');
    users.forEach(user => {
      console.log(`- ${user.email} (password: password123)`);
    });
    
    return { users, investments, transactions };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  seedDatabase,
  seedUsers,
  seedInvestments,
  seedTransactions,
};
