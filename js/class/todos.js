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
    getTasks = async () => {
        try {
            const response = await fetch(this.#backendURL);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const jsonData = await response.json();
            // Create tasks from JSON data
            this.#tasks = jsonData.map(task => new Task(task.id, task.description));
            // Return the tasks
            return this.#tasks;
        } catch (error) {
            throw new Error('Error fetching tasks: ' + error.message);
        }
    }

    // Add a new task to the array
    addNewTask = async (description) => {
        // Create JSON data
        const json = JSON.stringify({ description }); // Convert data to JSON format
        try {
            // Send JSON data to the server
            const response = await fetch(this.#backendURL + '/new', {
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
            return this.#addToArray(newTask);
        } catch (error) {
            throw new Error('Error saving task: ' + error.message);
        }
    }

    // Add a new task to the array
    #addToArray = (task) => {
        // Create a new task object
        const newTask = new Task(task.id, task.description);
        // Add the new task to the array
        this.#tasks.push(newTask);
        return newTask;
    }

    // Remove a task from the array
    #removeFromArray = (id) => {
        // Remove the task with the given id
        this.#tasks = this.#tasks.filter(task => task.id !== id);
    }

    // Remove a task from the server
    removeTask = async (id) => {
        try {
            // Send a request to the server
            const response = await fetch(`${this.#backendURL}/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            // Remove the task from the array
            this.#removeFromArray(id);
        } catch (error) {
            throw new Error('Error deleting task: ' + error.message);
        }
    }

}

// Export the Todos class
export { Todos };
