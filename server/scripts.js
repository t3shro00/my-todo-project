

// Define an array to store tasks
let tasks = [];

// Function to add a task
const addTask = (event) => {
    event.preventDefault(); // Prevent form submission

    // Get the input value
    const taskInput = document.getElementById('add-task');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        // Create a new task object
        const newTask = {
            id: id,
            text: task_description,
            due_date: due_date,
            completed: false,
        };

        // Push the task into the tasks array
        tasks.push(newTask);

        // Clear the input field
        taskInput.value = '';
        

        // Call function to render tasks
        renderTasks();
        // Show the main section
        document.getElementById('taskSection').classList.remove('d-none');
    }
}

// Function to render tasks
const renderTasks = (task) =>{
    const taskList = document.querySelector('.taskList');

    // Clear previous tasks
    taskList.innerHTML = '';

    // Render each task
    tasks.forEach(task => {
        // Create task item element
        const taskItem = document.createElement('li');
        taskItem.classList.add('task', 'list-group-item');

        // Create checkbox for task status
        const status = document.createElement('input');
        status.classList.add('form-check-input'); // Add Bootstrap class for checkbox
        status.type = 'checkbox';
        status.checked = task.completed; // Set checkbox checked status based on task.completed
        status.addEventListener('change', function () {
            task.completed = this.checked; // Update task.completed based on checkbox change
            if (this.checked) {
                taskName.style.textDecoration = 'line-through';
            } else {
                taskName.style.textDecoration = 'none';
            }
            
        });
        taskItem.appendChild(status); // Append checkbox to task item

        // Create task name span element
        const taskName = document.createElement('span');
        taskName.classList.add('task-name'); // Add class for styling
        taskName.textContent = task.text;
        taskItem.appendChild(taskName); // Append task name to task item

        // Create actions div for buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = '<i class="far fa-trash-alt"></i> Delete';
        deleteButton.addEventListener('click', function () {
            // Remove the task from the tasks array
            tasks = tasks.filter(t => t.id !== task.id);
            // Re-render tasks after deletion
            renderTasks();
        });
        actionsDiv.appendChild(deleteButton); // Append delete button to actions div

        // Append actions div to task item
        taskItem.appendChild(actionsDiv);

        // Append task item to task list
        taskList.appendChild(taskItem);
    });
}

// Add event listener to the form for adding tasks
document.querySelector('.todo-form').addEventListener('submit', addTask);

// Function to Save Task (saveTask)
saveData = ()=>{
    localStorage.setItem('data', taskList.innerHTML);
}


// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');

// const app = express();
// app.use(cors());
// const port = 3001;

// app.get('/', (req, res) => {
//     const pool = openDb();
//     pool.query('select * from task', (error, result) => {
//         if (error) {
//             res.status(500).json({ console.error(); })
//         }
//         res.status(200).json(result.rows);
//     })


// })
// // Configure connection pool
// const openDb = new Pool ({
//     user: 'postgres',
//     host: 'localhost',
//     database:'todo_proj',
//     password: 'postgres',
//     port:5432
// });