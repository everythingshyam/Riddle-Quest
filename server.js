const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Submit team completion time
app.post('/api/teams', async (req, res) => {
    try {
        const { teamName, completionTime, riddlesSolved } = req.body;
        
        if (!teamName || !completionTime) {
            return res.status(400).json({ error: 'Team name and completion time are required' });
        }

        const result = await pool.query(
            'INSERT INTO teams (team_name, completion_time, riddles_solved) VALUES ($1, $2, $3) RETURNING *',
            [teamName, completionTime, riddlesSolved || 3]
        );

        res.json({ success: true, team: result.rows[0] });
    } catch (error) {
        console.error('Error saving team:', error);
        res.status(500).json({ error: 'Failed to save team data' });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM teams ORDER BY completion_time ASC, completed_at ASC'
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Admin route to clear leaderboard
app.delete('/api/admin/clear-leaderboard', async (req, res) => {
    try {
        await pool.query('DELETE FROM teams');
        res.json({ success: true, message: 'Leaderboard cleared' });
    } catch (error) {
        console.error('Error clearing leaderboard:', error);
        res.status(500).json({ error: 'Failed to clear leaderboard' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Game: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
});