import { getTasks, createTask, deleteTask, updateTask } from './services/taskServices.js';

const createButton = document.querySelector('#create-task-button');

document.addEventListener("DOMContentLoaded",  () => {
    const tasks = JSON.parse(sessionStorage.getItem('Tasks'));
    if(tasks) {
        tasks.forEach(e => {
            createHTMLTask(e.taskID, [e.title, e.description, e.date, e.status]);
        });
    }
    //getTasks(tasks);
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
    const status = document.querySelector('#status-input');
    
    try {
        const response = await createTask(title.value, description.value, date.value, status.value);
        console.log('Client response: ', response);

        if(response) {
            createHTMLTask(response.taskID, [response.title, response.description, response.date, response.status]);
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
    newDiv.appendChild(newId);

    elementList.forEach((e, i) => {
        let newElement;

        if(i === 0) {
            newElement = document.createElement('h3');
            newElement.classList.add('task-title');
        } else {
            newElement = document.createElement(`p`);
            if(i === 1) {
                newElement.classList.add('task-description');
            } else if(i === 2) {
                newElement.classList.add('task-date');
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
    const title = parentDiv.querySelector('h3');

    try {
        const response = await deleteTask(title);
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
        //Hidding div if there is no tasks
        if(tasksDiv.children.length === 1) {
            mainConent.classList.add('hidden');
            sessionStorage.removeItem('Tasks');
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
    const isEditing = task.classList.contains("editing");

    if (isEditing) {
        // Guardar los cambios
        const titleInput = task.querySelector('input[name="title"]');
        const newTitle = document.createElement("h3");
        newTitle.textContent = titleInput.value;
        titleInput.replaceWith(newTitle);
        
        const descriptionInput = task.querySelector('input[name="description"]');
        const newDescription = document.createElement("p");
        newDescription.textContent = descriptionInput.value;
        descriptionInput.replaceWith(newDescription);

        const dateInput = task.querySelector('input[name="date"]');
        const newDate = document.createElement("p");
        newDate.textContent = dateInput.value;
        dateInput.replaceWith(newDate);
        
        const statusSelect = task.querySelector('select[name="status"]');
        const newStatus = document.createElement("p");
        newStatus.textContent = statusSelect.value;
        statusSelect.replaceWith(newStatus);
        
        console.log('Nuevos valores: ', );
        updateTask(task.querySelector('span'), [titleInput.value, descriptionInput.value, dateInput.value, statusSelect.value]);
        task.classList.remove("editing");
        event.target.textContent = "✏️";
    } else {
        // Pasar a modo edición
        const elements = task.querySelectorAll("h3, p");
  
        const [titleEl, descriptionEl, dateEl, statusEl] = elements;
  
        // Title
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.name = "title";
        titleInput.value = titleEl.textContent;
        titleEl.replaceWith(titleInput);
  
        // Description
        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.name = "description";
        descriptionInput.value = descriptionEl.textContent;
        descriptionEl.replaceWith(descriptionInput);
  
        // Date
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = "date";
        dateInput.value = dateEl.textContent;
        dateEl.replaceWith(dateInput);
  
        // Status
        const statusSelect = document.createElement("select");
        statusSelect.name = "status";

        ["Pending", "In Progress", "Completed"].forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            
            if (statusEl.textContent.trim().toLowerCase() === status.toLowerCase()) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });
        
        statusEl.replaceWith(statusSelect);
    
        task.classList.add("editing");
        event.target.textContent = "💾";
      }
}