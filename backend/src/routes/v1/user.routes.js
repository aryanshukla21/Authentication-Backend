const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

router.use(protect, restrictTo('admin'));

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json({ success: true, data: users });
    } catch (err) { next(err); }
});

router.patch('/:id/role', async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(422).json({ success: false, message: 'Invalid role' });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        await user.update({ role });
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err); }
});

module.exports = router;