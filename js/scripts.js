const backendURL = 'http://localhost:3001'; //
import { Todos } from './class/todos.js'; 
const todos = new Todos(backendURL); // Create an instance of the Todos class

const inputField = document.getElementById('taskInput');
inputField.disabled = true; // Disable the input field initially
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Get tasks from the backend
const getTasks = () => {
    // Fetch tasks from the backend
    todos.getTasks()
        .then((tasks) => {
            // Enable the input field
            inputField.disabled = false;

            // Iterate over the tasks
            tasks.forEach(task => {
                // Render each task
                renderTask(task);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error)); // Handle errors
}



function renderTask(task) {
    // Create a list item element
    const taskItem = document.createElement('li');
    const taskDescription = document.createElement('span');
    // Set the task description
    taskDescription.textContent = task.description;
    taskItem.appendChild(taskDescription);

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        // Send a DELETE request to the backend
        todos.removeTask(task.id)
            .then(() => {
                // Remove the task from the task list
                taskList.removeChild(taskItem);
            })
            .catch(error => console.error('Error deleting task:', error));
    }
    );
    // Append the delete button to the task item
    taskItem.appendChild(deleteButton);
    
    // Append the task item to the task list
    taskList.appendChild(taskItem);
}







// Save task to the backend
const saveTask = async (description) => {
    try {
        // Send a POST request to the backend
        const response = await fetch(backendURL + 'new', {
            method: 'POST', // HTTP method is set to POST
            headers: {
                'Content-Type': 'application/json' // Specify that the content type is JSON
            },
            body: JSON.stringify({ description }) // Convert data to JSON format
        })
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Failed to save task');
        }
        return response.json();
    } catch (error) {
        console.error('Error saving task:', error);

    }

}

// Add event listener to the input field
inputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addButton.click();
    }
});


addButton.addEventListener('click', () => {
    // Get the task description from the input field
    const newTaskDescription = inputField.value.trim();
    // Check if the task description is not empty
    if (newTaskDescription !== '') {
        // Save the task to the backend
        todos.addTask(newTaskDescription) // Update method name here
            .then((newTask) => {
                // Render the new task
                renderTask(newTask);
                // Clear the input field and set focus
                inputField.value = '';
                // Set focus to the input field
                inputField.focus();
            })
            .catch(error => console.error('Error adding new task:', error));
    } else {
        alert('Please enter a task description.');
    }
});


// Call the getTasks function to fetch tasks from the backend
getTasks();
