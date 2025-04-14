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
        console.log('Task saved in sessionStorage.', postData);

        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(postData)
        });

        return res;
    } catch (error) {
        console.error('[ERROR] Error in the Task creation request . ', error);
    }
    
}