const BASE_URL = 'http://localhost:3000/tasks';

export async function createTask(title, desc, date, status) {
    const postData = {
        title,
        description: desc,
        date,
        status
    };

    try {
        let tasks = JSON.parse(sessionStorage.getItem('Tasks'));

        if(tasks) {
            tasks.push(postData);    
        } else {
            tasks = [postData];
        }
        
        sessionStorage.setItem('Tasks', JSON.stringify(tasks));
        return postData;
    } catch (error) {
        console.error('[ERROR] Error in the Task creation request . ', error);
    }
    
}