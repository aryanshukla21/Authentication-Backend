const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const { validate, taskSchema } = require('../../middlewares/validate.middleware');

router.use(protect);  // all task routes require auth

router.route('/')
    .get(taskController.getTasks)
    .post(validate(taskSchema), taskController.createTask);

router.route('/:id')
    .get(taskController.getTask)
    .put(validate(taskSchema), taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;