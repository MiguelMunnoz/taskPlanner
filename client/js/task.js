import { createTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');

document.addEventListener("DOMContentLoaded",  () => {
    const tasks = JSON.parse(sessionStorage.getItem('Tasks'));

    tasks.forEach(e => {
        createHTMLTask([e.title, e.description, e.date, e.status]);
    });
});

createButton.addEventListener('click', async () => {
    const title = document.querySelector('#title-input');
    const description = document.querySelector('#description-input');
    const date = document.querySelector('#date-input');
    const status = document.querySelector('#status-input');
    
    try {
        const response = await createTask(title.value, description.value, date.value, status.value);
        console.log('Client response: ', response);
        if(response) {
            createHTMLTask([title.value, description.value, date.value, status.value]);
        }
        
    } catch (error) {
        console.error('[ERROR] Error creating task. ', error);
    }
});

function createHTMLTask(elementList) {
    const taskContainer = document.querySelector('.main-content-taskContainer');
    const newDiv = document.createElement('div');

    elementList.forEach((e, i) => {
        let newElement;
        
        if(i === 0) {
            newElement = document.createElement(`h3`);
        } else {
            newElement = document.createElement(`p`);
        }
        newElement.textContent = e;
        newDiv.appendChild(newElement);
    });
    const delButton = document.createElement('button');
    delButton.textContent = 'X';
    delButton.classList.add('delete-task-button');
    newDiv.appendChild(delButton);
    
    newDiv.classList.add('task');
    taskContainer.appendChild(newDiv);
}