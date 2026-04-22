const { Task, User } = require('../models');
const { Op } = require('sequelize');

exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: task });
    } catch (err) { next(err); }
};

exports.getTasks = async (req, res, next) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;
        const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Task.findAndCountAll({
            where, limit: parseInt(limit), offset,
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) }
        });
    } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id,
            { include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }] }
        );
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        if (req.user.role !== 'admin' && task.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        if (req.user.role !== 'admin' && task.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        await task.update(req.body);
        res.status(200).json({ success: true, data: task });
    } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        if (req.user.role !== 'admin' && task.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        await task.destroy();  // soft delete due to paranoid: true
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err) { next(err); }
};