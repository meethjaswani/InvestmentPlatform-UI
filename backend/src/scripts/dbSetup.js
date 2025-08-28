#!/usr/bin/env node

const { sequelize, initializeDatabase, resetDatabase } = require('../config/database');
const { seedDatabase } = require('../config/seedData');

const command = process.argv[2];

const showHelp = () => {
  console.log(`
📊 Database Management Script

Usage: node dbSetup.js [command]

Commands:
  init     - Initialize database and create tables
  reset    - Reset database (drop all tables and recreate)
  seed     - Seed database with sample data
  setup    - Full setup (reset + seed)
  help     - Show this help message

Examples:
  node dbSetup.js init
  node dbSetup.js setup
  node dbSetup.js seed
`);
};

const runCommand = async () => {
  try {
    switch (command) {
      case 'init':
        console.log('🚀 Initializing database...');
        await initializeDatabase();
        console.log('✅ Database initialization completed!');
        break;
        
      case 'reset':
        console.log('🔄 Resetting database...');
        await resetDatabase();
        console.log('✅ Database reset completed!');
        break;
        
      case 'seed':
        console.log('🌱 Seeding database...');
        await initializeDatabase(); // Ensure tables exist
        await seedDatabase();
        console.log('✅ Database seeding completed!');
        break;
        
      case 'setup':
        console.log('🏗️  Setting up database (reset + seed)...');
        await resetDatabase();
        await seedDatabase();
        console.log('✅ Database setup completed!');
        break;
        
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
        
      default:
        if (!command) {
          console.log('❌ No command provided.');
        } else {
          console.log(`❌ Unknown command: ${command}`);
        }
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runCommand();
