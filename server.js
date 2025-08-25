const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'simple-game.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Disabled API endpoints - database not available
app.post('/api/teams', (req, res) => {
    res.json({ success: true, message: 'Score tracking disabled' });
});

app.get('/api/leaderboard', (req, res) => {
    res.json([]);
});

app.delete('/api/admin/clear-leaderboard', (req, res) => {
    res.json({ success: true, message: 'Database not available' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Game: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
});