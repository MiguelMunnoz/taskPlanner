const BASE_URL = 'http://localhost:3000/tasks';
let taskID = 0;

export async function getTasks(tasks) {
    try {
        const res = await fetch(BASE_URL);
        return res;
    } catch (error) {
        console.error('[ERROR] Error gettinf tasks info. ', error);
    }
}

export async function createTask(title, desc, date, status) {
    const postData = {
        title,
        description: desc,
        date,
        status
    };

    taskID += 1;
    postData.taskID = taskID;

    try {
        let tasks = JSON.parse(sessionStorage.getItem('Tasks'));
         

        if(tasks) {
            
            tasks.push(postData);    
        } else {
            tasks = [postData];
        }
        
        sessionStorage.setItem('Tasks', JSON.stringify(tasks));
        console.log('Task saved in sessionStorage.', postData);

        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(postData)
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('[ERROR] Error in the Task creation request . ', error);
    }
}

export async function deleteTask(title) {
    try {
        const tasks = JSON.parse(sessionStorage.getItem('Tasks'));
        const otherTasks = tasks.filter(task => task.title.toLowerCase() !== title.textContent.toLowerCase());
        sessionStorage.setItem('Tasks', JSON.stringify(otherTasks));

        const res = await fetch(BASE_URL, {
            method: 'DELETE'
        });
        return res;
    } catch (error) {
        console.error('[ERROR] Error deleting the task request . ', error);
    }  
}

export async function updateTask(id, updatedData) {
    try {
        const tasks = JSON.parse(sessionStorage.getItem('Tasks'));
        const updatedTask = tasks.filter(task => task.taskID === id);
        console.log(updatedTask);
    } catch (error) {
        console.error('[ERROR] Error updating the task request . ', error);
    }
}