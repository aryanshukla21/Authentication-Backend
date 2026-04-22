const User = require('./user.model');
const Task = require('./task.model');

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

module.exports = { User, Task };