const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

// Configure connection pool
const openDb = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database:'todo_proj',
    password: 'postgres',
    port:5432
});

// Route to fetch data from the database
app.get('/data', async (req, res) => {
    try {
      // Query to fetch data
      const query = 'SELECT * FROM todo_list';
      // Execute query
      const { rows } = await openDb.query(query);
      // Send data as JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



app.get('/', (req, res) => {
    res.send('Life fucked up vako xa!')
})


app.get('/home/', (req, res) => {
    res.status(200).json({result: 'sucess'})
})

app.get('/example', (req, res) => {
    // This is a route handler for GET requests to '/example'
    res.send('This is an example response');
});

app.listen(port, () => {
    console.log('Example app listening on port ' + port);
})