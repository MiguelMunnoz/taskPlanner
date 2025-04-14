const { getTasks, createTask, deleteTask, updateTask } = require('../services/taskServices');

const taskController = {
    getTasksController: [
        async (req, res) => {
            try {
                const data = await getTasks();
                response.status(200).json(data);
            } catch (error) {
                console.log('[ERROR] Error getting task info. ', error);
                response.status(500).json({ error: '[ERROR] Error getting task info.' });
            }
        }
    ],
    createTaskController: [],
    updateTaskController: [],
    deleteTaskController: []
};

module.exports = taskController;