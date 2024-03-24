const express = require('express');
const { query } = require('../helpers/db.js'); 

const todoRouter = express.Router(); // Create an instance of Express Router

todoRouter.use(express.json());

todoRouter.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM task');
        const rows = result.rows ? result.rows : []; 
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
        res.statusMessage = error.message;

    }
});

todoRouter.post('/new', async (req, res) => {
    const { description } = req.body; // Extract description from req.body
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING id', [description]);
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.log(error);
        res.statusMessage = error.message;
        res.status(500).json({ error: error.message });
    }
});

todoRouter.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await query('DELETE FROM task WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ id });
    } catch (error) {
        console.log(error);
        res.statusMessage = error.message;
        res.status(500).json({ error: error.message });
    }
});

module.exports = todoRouter;
