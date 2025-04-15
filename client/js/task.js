import { getTasks, createTask, deleteTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');
const deleteButtons = document.querySelectorAll('.delete-task-button');

document.addEventListener("DOMContentLoaded",  () => {
    const tasks = JSON.parse(sessionStorage.getItem('Tasks'));
    if(tasks) {
        tasks.forEach(e => {
            createHTMLTask([e.title, e.description, e.date, e.status]);
        });
    }
    //getTasks(tasks);
});

document.addEventListener('click', async (event) => {
    if(event.target.classList.contains('delete-task-button')) {
        const parentDiv = event.target.parentElement;
        const title = parentDiv.querySelector('h3');

        try {
            const response = await deleteTask(title);
            console.log(response);
            removeTaskDiv(parentDiv);
            //parentDiv.remove();
        } catch (error) {
            console.error('[ERROR] Error deleting task. ', error);
        }
    }
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
    taskContainer.parentElement.classList.remove('hidden');
}

function removeTaskDiv(task) {
    const tasksDiv = task.parentElement;
    const mainConent = tasksDiv.parentElement;

    //Applying delete transition
    task.classList.add('fade-out');

    setTimeout(()=> {
        //Hidding div if there is no tasks
        if(tasksDiv.children.length === 1) {
            mainConent.classList.add('hidden');
            sessionStorage.removeItem('Tasks');
        }

        task.remove();

    }, 300);

    
}