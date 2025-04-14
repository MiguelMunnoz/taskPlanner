import { createTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');

createButton.addEventListener('click', async () => {
    const title = document.querySelector('#title-input');
    const description = document.querySelector('#description-input');
    const date = document.querySelector('#date-input');
    const status = document.querySelector('#status-input');
    console.log('Boton clickado');
    try {
        const response = await createTask(title.value, description.value, date.value, status.value);
        console.log(response);
    } catch (error) {
        console.error('[ERROR] Error creating task. ', error);
    }
});