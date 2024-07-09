const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({
    user: 'yourusername',
    host: 'localhost',
    database: 'yourdatabase',
    password: 'yourpassword',
    port: 5432,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all goats
app.get('/goats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM goats');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new goat
app.post('/goats', async (req, res) => {
    const { name, age, vaccination_time, vaccination_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO goats (name, age, vaccination_time, vaccination_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, age, vaccination_time, vaccination_type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a goat
app.put('/goats/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, vaccination_time, vaccination_type } = req.body;
    try {
        const result = await pool.query(
            'UPDATE goats SET name = $1, age = $2, vaccination_time = $3, vaccination_type = $4 WHERE id = $5 RETURNING *',
            [name, age, vaccination_time, vaccination_type, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a goat
app.delete('/goats/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM goats WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});