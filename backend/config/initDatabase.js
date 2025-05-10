const sequelize = require('./database');
const QueryHistory = require('../models/QueryHistory');

async function initDatabase() {
    try {
        // Sync all models with database
        await sequelize.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

module.exports = initDatabase; 