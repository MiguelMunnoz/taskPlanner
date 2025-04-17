import { getTasks, createTask, deleteTask, updateTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');
const statusFilter = document.querySelector('#status-filter');

document.addEventListener('DOMContentLoaded', async () => {
    paintHTMLTasks(getAndFilterTasks(statusFilter.value));

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

statusFilter.addEventListener('change', async () => {
    paintHTMLTasks(getAndFilterTasks(statusFilter.value));
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
            paintHTMLTasks(getAndFilterTasks(statusFilter.value));
        }

    } catch (error) {
        console.error('[ERROR] Error creating task. ', error);
    }
});

function getAndFilterTasks(filter) {
    const tasks = JSON.parse(localStorage.getItem('Tasks'));

    if(tasks) {
        const filteredTasks = tasks.filter(task => (task.status === filter || filter === 'all'));
        return filteredTasks;
    } else {
        return [];
    }
}

function paintHTMLTasks(tasks) {
    const notFoundMessage = document.querySelector('#not-found-message');
    const taskContainer = document.querySelector('.main-content-taskContainer');
    taskContainer.replaceChildren();

    if(tasks.length > 0) {
        tasks.forEach(task => {
            createHTMLTask(task.taskID, [task.title, task.status, task.date, task.time, task.description]);
        });
        notFoundMessage.classList.add('hidden');
    } else {
        notFoundMessage.classList.remove('hidden');
    }
}

function createHTMLTask(id, taskValues) {
    const taskContainer = document.querySelector('.main-content-taskContainer');
    const newDiv = document.createElement('div');

    //Creamos los botones de eliminacion y edicion de cada tarea
    const delButton = document.createElement('button');
    const editButton = document.createElement('button');
    delButton.textContent = 'X';
    editButton.textContent = '✏️';
    delButton.classList.add('delete-task-button');
    editButton.classList.add('edit-task-button');

    //Añadimos un id para manejar mejor cada tarea
    const newId = document.createElement('span');
    newId.classList.add('hidden');
    newId.textContent = id;
    newDiv.appendChild(newId);

    //Creamos los campos para almacenar los datos del fomulario
    taskValues.forEach((taskElement, i) => {
        
        let newElement;
        if (i === 0) {
            newElement = document.createElement('h3');
            newElement.classList.add('task-title');
            newElement.textContent = taskElement.charAt(0).toUpperCase() + taskElement.slice(1);
        } else {
            newElement = document.createElement('p');
        
            switch (i) {
                case 1:
                    newElement = document.createElement('span');
                    newElement.classList.add('task-status');
                    newElement.classList.add(`status-${taskElement.toLowerCase().replace(/\s/g, '-')}`); // añade clase dinámica
                    newElement.textContent = taskElement.charAt(0).toUpperCase() + taskElement.slice(1);
                    break;
                case 2:
                    newElement.classList.add('task-date');
                    newElement.textContent = taskElement;
                    break;
                case 3:
                    newElement.classList.add('task-time');
                    newElement.textContent = taskElement;
                    break;
                case 4:
                    const descSpan = document.createElement('span');
                    descSpan.textContent = 'Description:';
                    const textNode = document.createTextNode(` ${taskElement}`);

                    newElement.appendChild(descSpan);
                    newElement.appendChild(textNode);
                    newElement.classList.add('task-description');
                    break;
            }
        }

        newDiv.appendChild(newElement);
    });
    
    newDiv.appendChild(delButton);
    newDiv.appendChild(editButton);
    newDiv.classList.add('task');

    taskContainer.appendChild(newDiv);
    taskContainer.classList.remove('hidden');
}

function cleanForm(title, description, date, time, status) {
    title.value = '',
    description.value = '',
    date.value = '',
    time.value = '',
    status.value = 'pending' 
}

async function deleteHTMLTask(event) {
    const parentDiv = event.target.parentElement;
    const id = parentDiv.querySelector('span');

    const confirmDelete = confirm(`Are you sure you want to delete this task?`);
    if (!confirmDelete) {
        return;
    }

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
            tasksDiv.classList.add('hidden');
            //mainConent.classList.add('hidden');
            localStorage.removeItem('Tasks');
        }
        task.remove();
    }, 300);
}

async function editHTMLTask(event) {
    const task = event.target.parentElement;

    // Detectamos si estamos en modo edición o no
    const isEditing = task.classList.contains('editing');

    if (isEditing) {

        const confirmUpdate = confirm(`Are you sure you want to update this task?`);
        if (!confirmUpdate) {
            return;
        }

        // Guardar los cambios y eliminar los estilos de edicion
        const titleInput = deleteEditInput(task, 'title', 'h3');
        const descriptionInput = deleteEditInput(task, 'description','p');
        const dateInput = deleteEditInput(task, 'date', 'p');
        const timeInput = deleteEditInput(task, 'time', 'p');
        const statusInput = deleteEditInput(task, 'status', 'p');

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
        // Pasar a modo edicion
        const elements = task.querySelectorAll('h3, p, span');
        const [idHTML, titleHTML, statusHTML, dateHTML, timeHTML, descriptionHTML] = elements;
        
        createEditInput('Title', 'text', titleHTML);
        createEditInput('Status', ['Pending', 'In Progress', 'Completed'], statusHTML);
        createEditInput('Date', 'date', dateHTML);
        createEditInput('Time', 'time', timeHTML);
        createEditInput('Description', 'text', descriptionHTML);
    
        task.classList.add('editing');
        event.target.textContent = '💾';
      }
}

function createEditInput(labelText, inputType, elementHTML){
    let inputElement;

    if(typeof inputType !== 'string') {
        inputElement = document.createElement('select');
        inputElement.name = labelText.toLowerCase();
 
        inputType.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
             
            if (elementHTML.textContent.trim().toLowerCase() === status.toLowerCase()) {
                option.selected = true;
            }
 
            inputElement.appendChild(option);
         });

    } else {
        inputElement = document.createElement('input');
        inputElement.type = inputType;
        inputElement.name = labelText.toLowerCase();
        inputElement.value = elementHTML.textContent;
    }

    //Adding labels and wrapping info in a div
    const wrapperDiv = document.createElement('div');
    const label = document.createElement('label');
    
    label.textContent = labelText;
    wrapperDiv.appendChild(label);
    wrapperDiv.appendChild(inputElement);
    elementHTML.replaceWith(wrapperDiv);
}

function deleteEditInput(task, name, elementType) {
    let taskDiv;
    let elementInput;
    const newElement = document.createElement(`${elementType}`);

    if(name === 'status') {
        taskDiv = task.querySelector(`select[name=${name}]`).parentElement; 
        elementInput = taskDiv.querySelector('select');
        newElement.classList.add(`status-${elementInput.value.toLowerCase().replace(/\s/g, '-')}`);
    } else {
        taskDiv = task.querySelector(`input[name=${name}]`).parentElement;
        elementInput = taskDiv.querySelector('input');
    }

    
    newElement.textContent = elementInput.value;
    newElement.classList.add(`task-${name}`);
    taskDiv.replaceWith(newElement);

    return elementInput;
}