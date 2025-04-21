const API_TOKEN = 'ATTA90d3f5f65dcf80d84e12159c1f09512af54f2555fdfe2d2141fb0a59ccf613bf5EB72E21'
const API_KEY = '9af859ddcb09f5323f37eaf0c3cd203b'

export async function getBoards() {
    const url = `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${API_TOKEN}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error: ', response.status);
        }

        const data = await response.json();
        return data;

    } catch(error) {
        console.error('[ERROR] gettig boards. ', error);
        return null;
    }
}
  
export async function getLists(boardId) {
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${API_TOKEN}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error: ', response.status);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("[ERROR] Error getting Trello's list. ", error);
        return null;
    }   
}

export async function createBoard(name) {
    const url = `https://api.trello.com/1/boards/?name=${encodeURIComponent(name)}&defaultLists=false&key=${API_KEY}&token=${API_TOKEN}`;
    
    try {
        const response = await fetch(url, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Error: ', response.status);
        } 

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[ERROR] Error creating board in Trello. ', error);
        return null
    }
    
}

export async function createList(boardId, listName) {
    const url = `https://api.trello.com/1/lists?name=${encodeURIComponent(listName)}&idBoard=${boardId}&key=${API_KEY}&token=${API_TOKEN}`;
    
    try {
        const response = await fetch(url, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Error: ', response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[ERROR] Error creating board in Trello. ', error);
        return null
    }
}
  
export async function createCard(listId, name, desc) {
    const url = `https://api.trello.com/1/cards?key=${API_KEY}&token=${API_TOKEN}&idList=${listId}&name=${name}&desc=${desc}`;
    console.log(url);
    try {
        const response = await fetch(url, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Error: ', response.status);
        } 
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[ERROR] Error creating card in Trello. ", error);
        return null;
    }
}