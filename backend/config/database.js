const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.storage,
    logging: false // Set to true for SQL query logging
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize; 