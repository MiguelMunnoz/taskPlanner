const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasksController);
router.post('/', taskController.createTaskController);
router.delete('/', taskController.deleteTaskController);
router.put('/', taskController.updateTaskController);

module.exports = router;
