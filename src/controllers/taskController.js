// const { getTasks, createTask, deleteTask, updateTask } = require('../services/taskServices');

const taskController = {
    getTasksController: [
        async (req, res) => {
            try {
                const data = 'Bienvenido a tasks';
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
                console.log(data);
                res.status(201).json(data);
            } catch (error) {
                console.log('[ERROR] Error creating task. ', error);
                res.status(500).json({ error: '[ERROR] Error creating task.' });
            }
        }
    ],

    /*updateTaskController: [
        async (req, res) => {
            try {
                const postData = req.body;
                console.log(postData);
                sessionStorage.setItem(postData);
                res.status(200).json(data);
            } catch (error) {
                console.log('[ERROR] Error getting task info. ', error);
                res.status(500).json({ error: '[ERROR] Error getting task info.' });
            }
        }
    ],
    deleteTaskController: []*/
};

module.exports = taskController;