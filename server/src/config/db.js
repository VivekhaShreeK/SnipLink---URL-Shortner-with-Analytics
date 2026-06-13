const { Sequelize } = require('sequelize');
const { DATABASE_URL, NODE_ENV } = require('./env');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false,
  dialectOptions: NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully via Sequelize.');
    // Sync models to automatically create tables
    await sequelize.sync();
    console.log('✅ Database schemas synced.');
  } catch (error) {
    console.error(`❌ PostgreSQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
