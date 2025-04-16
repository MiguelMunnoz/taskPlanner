import { getTasks, createTask, deleteTask, updateTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');

document.addEventListener('DOMContentLoaded', async () => {
    const tasks = JSON.parse(localStorage.getItem('Tasks'));
    if(tasks) {
        tasks.forEach(e => {
            createHTMLTask(e.taskID, [e.title, e.description, e.date, e.time, e.status]);
        });
    }
    const response = await getTasks();
    console.log('Client response: ', response);
});

document.addEventListener('click', async (event) => {
    
    if(event.target.classList.contains('delete-task-button')) {
        deleteHTMLTask(event);
    } else if (event.target.classList.contains('edit-task-button')) {
        editHTMLTask(event);
    }
});

createButton.addEventListener('click', async () => {
    const title = document.querySelector('#title-input');
    const description = document.querySelector('#description-input');
    const date = document.querySelector('#date-input');
    const time = document.querySelector('#time-input');
    const status = document.querySelector('#status-input');
    
    try {
        const response = await createTask(title.value, description.value, date.value, time.value, status.value);
        console.log('Client response: ', response);

        if(response) {
            cleanForm(title, description, date, time, status);
            createHTMLTask(response.taskID, [response.title, response.description, response.date, response.time, response.status]);
        }

    } catch (error) {
        console.error('[ERROR] Error creating task. ', error);
    }
});

function createHTMLTask(id, elementList) {
    const taskContainer = document.querySelector('.main-content-taskContainer');
    const newDiv = document.createElement('div');

    const delButton = document.createElement('button');
    const editButton = document.createElement('button');
    
    delButton.textContent = 'X';
    editButton.textContent = '✏️';
    
    delButton.classList.add('delete-task-button');
    editButton.classList.add('edit-task-button');

    const newId = document.createElement('span');
    newId.classList.add('hidden');
    newId.textContent = id;
    newDiv.appendChild(newId);

    //Nucleo de la funcion de creacion
    elementList.forEach((e, i) => {
        let newElement;

        /*switch (i) {
            case 0:
                newElement = document.createElement('h3');
                newElement.classList.add('task-title');
            case 1:
                newElement = document.createElement(`p`);
                newElement.classList.add('task-description');
            case 2:
                newElement = document.createElement(`p`);
                newElement.classList.add('task-date');
            case 3:
                newElement = document.createElement(`p`);
                newElement.classList.add('task-time');
            case 4:
                newElement = document.createElement(`p`);
                newElement.classList.add('task-status');
        }*/
        if(i === 0) {
            newElement = document.createElement('h3');
            newElement.classList.add('task-title');
        } else {
            newElement = document.createElement(`p`);
            if(i === 1) {
                newElement.classList.add('task-description');
            } else if(i === 2) {
                newElement.classList.add('task-date');
            } else if(i === 3) {
                newElement.classList.add('task-time');
            } else {
                newElement.classList.add('task-status');
            }
        }
        newElement.textContent = e;
        newDiv.appendChild(newElement);
    });
    
    newDiv.appendChild(delButton);
    newDiv.appendChild(editButton);
    newDiv.classList.add('task');

    taskContainer.appendChild(newDiv);
    taskContainer.parentElement.classList.remove('hidden');
}

async function deleteHTMLTask(event) {
    const parentDiv = event.target.parentElement;
    const id = parentDiv.querySelector('span');

    try {
        const response = await deleteTask(id);
        console.log('Client response: ', response);
        removeTaskDiv(parentDiv);
    } catch (error) {
        console.error('[ERROR] Error deleting task. ', error);
    }
}

function removeTaskDiv(task) {
    const tasksDiv = task.parentElement;
    const mainConent = tasksDiv.parentElement;

    //Applying delete transition
    task.classList.add('fade-out');

    setTimeout(()=> {
        //Hidding div if there are no tasks
        if(tasksDiv.children.length === 1) {
            mainConent.classList.add('hidden');
            localStorage.removeItem('Tasks');
        }

        task.remove();

    }, 300);
}

async function editHTMLTask(event) {
    const task = event.target.parentElement;
    
    if (!task){
        return;
    } 

    // Detectamos si estamos en modo edición o no
    const isEditing = task.classList.contains('editing');

    if (isEditing) {
        // Guardar los cambios
        const titleDiv = task.querySelector('input[name="title"]').parentElement;
        const titleInput = titleDiv.querySelector('input');
        const newTitle = document.createElement('h3');
        newTitle.textContent = titleInput.value;
        titleDiv.replaceWith(newTitle);
        
        const descriptionDiv = task.querySelector('input[name="description"]').parentElement;
        const descriptionInput = descriptionDiv.querySelector('input');
        const newDescription = document.createElement('p');
        newDescription.textContent = descriptionInput.value;
        descriptionDiv.replaceWith(newDescription);

        const dateDiv = task.querySelector('input[name="date"]').parentElement;
        const dateInput = dateDiv.querySelector('input');
        const newDate = document.createElement('p');
        newDate.textContent = dateInput.value;
        dateDiv.replaceWith(newDate);

        const timeDiv = task.querySelector('input[name="time"]').parentElement;
        const timeInput = timeDiv.querySelector('input');
        const newTime = document.createElement('p');
        newTime.textContent = timeInput.value;
        timeDiv.replaceWith(newTime);
        
        const statusDiv = task.querySelector('select[name="status"]').parentElement;
        const statusInput = statusDiv.querySelector('select');
        const newStatus = document.createElement('p');
        newStatus.textContent = statusInput.value;
        statusDiv.replaceWith(newStatus);

        const updateData = {
            title: titleInput.value, 
            description: descriptionInput.value, 
            date: dateInput.value,
            time: timeInput.value, 
            status: statusInput.value
        };
        
        const response = await updateTask(task.querySelector('span'), updateData);
        console.log('Client response: ', response);
        
        task.classList.remove('editing');
        event.target.textContent = '✏️';
    } else {
        // Pasar a modo edición
        const elements = task.querySelectorAll('h3, p');
        const [titleHTML, descriptionHTML, dateHTML, timeHTML, statusHTML] = elements;
  
        // Title
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.name = 'title';
        titleInput.value = titleHTML.textContent;
        titleHTML.replaceWith(createEditInput('Title', titleInput));
  
        // Description
        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.name = 'description';
        descriptionInput.value = descriptionHTML.textContent;
        descriptionHTML.replaceWith(createEditInput('Description', descriptionInput));
  
        // Date
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.name = 'date';
        dateInput.value = dateHTML.textContent;
        dateHTML.replaceWith(createEditInput('Date', dateInput));

        // Time
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.name = 'time';
        timeInput.value = timeHTML.textContent;
        timeHTML.replaceWith(createEditInput('Time', timeInput));
  
        // Status
        const statusInput = document.createElement('select');
        statusInput.name = 'status';

        ['Pending', 'In Progress', 'Completed'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            
            if (statusHTML.textContent.trim().toLowerCase() === status.toLowerCase()) {
                option.selected = true;
            }

            statusInput.appendChild(option);
        });
        
        statusHTML.replaceWith(createEditInput('Status', statusInput));
    
        task.classList.add('editing');
        event.target.textContent = '💾';
      }
}

function createEditInput(labelText, inputElement) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    div.appendChild(label);
    div.appendChild(inputElement);
    return div;
}

function cleanForm(title, description, date, time, status) {
    title.value = '',
    description.value = '',
    date.value = '',
    time.value = '',
    status.value = 'pending' 
}