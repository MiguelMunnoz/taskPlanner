// const { getTasks, createTask, deleteTask, updateTask } = require('../services/taskServices');

const taskController = {
    getTasksController: [
        async (req, res) => {
            try {
                const data = req;
                res.status(200).json(data);
            } catch (error) {
                console.log('[ERROR] Error getting task info. ', error);
                res.status(500).json({ error: '[ERROR] Error getting task info.' });
            }
        }
    ],

    createTaskController: [
        async (req, res) => {
            try {
                const data = req.body;
                console.log('Task created succesfully.');
                res.status(201).json(data);
            } catch (error) {
                console.log('[ERROR] Error creating task. ', error);
                res.status(500).json({ error: '[ERROR] Error creating task.' });
            }
        }
    ],

    updateTaskController: [
        async (req, res) => {
            try {
                const putData = req.body;
                console.log('Task updated succesfully.');
                res.status(200).json(putData);
            } catch (error) {
                console.log('[ERROR] Error updating task info. ', error);
                res.status(500).json({ error: '[ERROR] Error updating task info.' });
            }
        }
    ],

    deleteTaskController: [
        async (req, res) => {
            try {
                const data = 'Task deleted succesfully.';
                res.status(204).json(data);
            } catch (error) {
                console.log('[ERROR] Error getting task info. ', error);
                res.status(500).json({ error: '[ERROR] Error getting task info.' });
            }
        }
    ]
};

module.exports = taskController;