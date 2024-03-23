import { Task } from './task.js';

class Todos {
    // Private field to store the backend URL
    #backendURL = '';
    // Array to store tasks
    #tasks = [];

    // Constructor method for creating instances of Todos
    constructor(backendURL) {
        this.#backendURL = backendURL;
    }
    
    // Fetch tasks from the server
    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#backendURL);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const jsonData = await response.json();
                // Create tasks from JSON data
                this.#tasks = jsonData.map(task => new Task(task.id, task.description));
                // Return the tasks
                resolve(this.#tasks);
            } catch (error) {
                reject(new Error('Error fetching tasks: ' + error.message));
            }
        });
    }

    // Add a new task to the array
    addNewTask = (description) => {
        // Create JSON data
        return new Promise(async (resolve, reject) => {
            // Create JSON data
            const json = JSON.stringify({ description }); // Convert data to JSON format
            try {
                // Send JSON data to the server
                const response = await fetch(this.#backendURL + 'new', {
                    method: 'POST', // HTTP method is set to POST
                    headers: {
                        'Content-Type': 'application/json' // Specify that the content type is JSON
                    },
                    body: json // Convert data to JSON format
                });
                if (!response.ok) {
                    throw new Error('Failed to save task');
                }
                // Get the new task data and convert it to JSON format
                const newTaskData = await response.json(); 
                // Create a new task 
                const newTask = new Task(newTaskData.id, description);  
                // Add the new task to the array
                resolve(this.#addToArray(newTask));
            } catch (error) {
                reject(new Error('Error saving task: ' + error.message));
            }
        }
        )
    }
    // Add a new task to the array
    #addToArray = (task) => {
        // Create a new task object
        const newTask = new Task(task.id, task.description);
        // Add the new task to the array
        this.#tasks.push(newTask);
        return newTask;
    }

    // Read JSON data and create tasks
    #readJson = (jsonData) => {
        try {
            // Parse JSON data
            const data = JSON.parse(jsonData);

            // Check if data is an array
            if (!Array.isArray(data)) {
                throw new Error('Invalid JSON format');
            }
            // Create tasks from JSON data
            this.#tasks = data.map(task => new Task(task.id, task.description));
        } catch (error) {
            throw new Error('Error reading JSON: ' + error.message);
        }
    };


    // Remove a task from the array
    #removeFromArray = (id) => {
        // Remove the task with the given id
        this.#tasks.filter(task => task.id !== id);
    }

    // Remove a task from the server
    removeTask = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Send a request to the server
                const response = await fetch(`${this.#backendURL}delete/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }
                // Remove the task from the array
                resolve(this.#removeFromArray(id));
            } catch (error) {
                reject(new Error('Error deleting task: ' + error.message));
            }
        });
    }

}

// Export the Todos class
export { Todos };




