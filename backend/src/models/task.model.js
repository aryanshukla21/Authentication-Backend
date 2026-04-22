const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false, validate: { notEmpty: true, len: [1, 200] } },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'done'),
        defaultValue: 'pending',
        validate: { isIn: [['pending', 'in_progress', 'done']] }
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } }
}, {
    tableName: 'tasks',
    timestamps: true,
    paranoid: true  // soft delete — sets deletedAt instead of removing row
});

module.exports = Task;