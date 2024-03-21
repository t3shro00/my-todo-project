const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express(); // Define the Express app
app.use(cors());
app.use(express.json());
const port = 3001;

// Configure connection pool
const openDb = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_proj',
    password: 'postgres',
    port: 5432
});

// Define routes and other middleware here

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Route to fetch all tasks from the database
app.get('/tasks', async (req, res) => {
  try {
      const query = 'SELECT * FROM todo_list';
      const { rows } = await openDb.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add a new task to the database
app.post('/tasks', async (req, res) => {
  try {
      const { task } = req.body;
      const query = 'INSERT INTO todo_list (task) VALUES ($1) RETURNING *';
      const { rows } = await openDb.query(query, [task]);
      res.status(201).json(rows[0]);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a task from the database
app.delete('/tasks/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const query = 'DELETE FROM todo_list WHERE id = $1';
      await openDb.query(query, [id]);
      res.json({ success: true });
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


const BACKEND_ROOT_URL = 'http://localhost:3001/';

const getTasks = async () => {
  try {
    const response = await fetch(`${BACKEND_ROOT_URL}/tasks`);
    const json =  await response.json();
    json.forEach(task => {
      renderTasks(task.task_description)
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}
