const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QueryHistory = sequelize.define('QueryHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    query: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

QueryHistory.sync();


module.exports = QueryHistory; 