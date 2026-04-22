const { validationResult, body } = require('express-validator');

const validate = (schemas) => [
    ...schemas,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
            });
        }
        next();
    }
];

const registerSchema = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .custom((value, { req }) => {
            // DIAGNOSTIC: This will print to your BACKEND terminal
            console.log("Password received by backend:", value);

            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);

            if (!hasUpper || !hasLower || !hasNumber) {
                return false;
            }
            return true;
        })
        .withMessage('Password must contain uppercase, lowercase, and a number'),
];

const loginSchema = [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const taskSchema = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('status').optional().isIn(['pending', 'in_progress', 'done']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),

    // THE FIX: Only validate if the date is NOT an empty string
    body('dueDate')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Invalid date format (Use YYYY-MM-DD)')
];

module.exports = { validate, registerSchema, loginSchema, taskSchema };