const backendURL = 'http://localhost:3001/';
const inputField = document.getElementById('taskInput');
inputField.disabled = true; // Disable the input field initially
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

function renderTask(task) {
    // Create a list item element
    const taskItem = document.createElement('li');

    // Set the text content of the list item to the task description
    taskItem.textContent = task.description;

    // Append the list item to the task list
    taskList.appendChild(taskItem);
}


function getTasks() {
    // Fetch tasks from the backend
    fetch(backendURL)
        // Parse the JSON response
        .then(response => response.json())
        .then(data => {
            // Iterate over each task and render it
            data.forEach(task => renderTask(task));

            // Enable the input field after rendering tasks
            inputField.disabled = false;
        })
        .catch(error => console.error('Error fetching tasks:', error)); // Handle errors
}


function saveTask(description) {
    return fetch(backendURL + 'new', {
        method: 'POST', // HTTP method is set to POST
        headers: {
            'Content-Type': 'application/json' // Specify that the content type is JSON
        },
        body: JSON.stringify({ description }) // Convert data to JSON format
    });
}


inputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addButton.click();
    }
});

addButton.addEventListener('click', () => {
    const newTaskDescription = inputField.value.trim();
    if (newTaskDescription !== '') {
        renderTask({ description: newTaskDescription }); // Render task immediately
        saveTask(newTaskDescription)
            .then(() => {
                inputField.value = ''; // Clear input field on successful save
            })
            .catch(error => console.error('Error saving task:', error));
    } else {
        alert('Please enter a task description.');
    }
});

getTasks();
