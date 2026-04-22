const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password, ...(role && { role }) });
        const token = signToken(user.id, user.role);
        res.status(201).json({ success: true, token, data: user });
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        // Same message for both cases — prevents user enumeration
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account deactivated' });
        }
        const token = signToken(user.id, user.role);
        res.status(200).json({ success: true, token, data: user });
    } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};