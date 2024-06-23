const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const todos = sequelize.define('Todos', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    deadline: { type: DataTypes.DATEONLY, allowNull: true },
    createdAt: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
    }, {
    timestamps: false
});

const completedTodos = sequelize.define('Completed Todos', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    deadline: { type: DataTypes.DATEONLY, allowNull: true },
    createdAt: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
    }, {
    timestamps: false
});

module.exports = {
    todos, 
    completedTodos
};