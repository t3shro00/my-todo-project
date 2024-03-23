const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_proj',
    password: 'postgres',
    port: 5432
});

// Get all tasks
app.get('/', (req, res) => {
    try {
        // Query to get all tasks from the database
        pool.query('SELECT * FROM task', (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result.rows);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new task
app.post('/new', (req, res) => {
    // Get the task description from the request body
    const { description } = req.body;
    // Check if the description is empty
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }
    // Query to insert a new task into the database
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING id', [description], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // Return a success message along with the ID of the new task
        res.status(200).json({ message: 'Task added successfully', id: result.rows[0].id });
    });
});

// Delete a task
app.delete('/delete/:id', (req, res) => {
    // Get the task ID from the request parameters
    const id = parseInt(req.params.id);
    try {
        // Query to delete a task from the database
        pool.query('DELETE FROM task WHERE id = $1', [id], (error, result) => {
            if (error) {
                // Return a general error message
                return res.status(500).json({ error: error.message });
            }
            if (result.rowCount === 0) {
                // If no rows were affected, the task wasn't found
                return res.status(404).json({ error: 'Task not found' });
            }
            // Update the IDs of the remaining records
            pool.query('UPDATE task SET id = id - 1 WHERE id > $1', [id], (updateError, updateResult) => {
                if (updateError) {
                    // Handle the update error
                    return res.status(500).json({ error: updateError.message });
                }
                // Return a success message
                res.status(200).json({ message: `Task ${id} deleted successfully` });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// listen to the port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});