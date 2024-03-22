import { Task } from './task.js';

class Todos {
    #backendURL = '';
    #tasks = [];

    constructor(backendURL) {
        this.#backendURL = backendURL;
    }

    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#backendURL);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const jsonData = await response.json();
                this.#tasks = jsonData.map(task => new Task(task.id, task.description));
                resolve(this.#tasks);
            } catch (error) {
                reject(new Error('Error fetching tasks: ' + error.message));
            }
        });
    }

    addNewTask = (description) => {
        return new Promise(async (resolve, reject) => {
            const json = JSON.stringify({ description });
            try {
                const response = await fetch(this.#backendURL + 'new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                });
                if (!response.ok) {
                    throw new Error('Failed to save task');
                }
                const newTaskData = await response.json();
                const newTask = new Task(newTaskData.id, description);
                resolve(this.#addToArray(newTask));
            } catch (error) {
                reject(new Error('Error saving task: ' + error.message));
            }
        }
        )
    }



    #readJson = (jsonData) => {
        try{
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data)) {
                throw new Error('Invalid JSON format');
            }
            this.#tasks = data.map(task => new Task(task.id, task.description));
        } catch (error) {
            throw new Error('Error reading JSON: ' + error.message);
        }
    };

    #addToArray = (task) => {
        const newTask = new Task(task.id, task.description);
        this.#tasks.push(newTask);
        return newTask;
    }

}

export { Todos };



// getTasks() {
//     return new Promise((resolve, reject) => {
//         fetch(this.#backend_url)
//             .then(response => response.json())
//             .then((json) => {
//                 this.#tasks = json.map(task => new Task(task.id, task.description));
//                 resolve(this.#tasks);
//             })
//             .catch(error => reject(error));
//         });
//     };

//     #readJson = (taskAsJson) => {
//         taskAsJson.forEach(task => {
//             this.#tasks.push(new Task(task.id, task.description));
//         });
//     };