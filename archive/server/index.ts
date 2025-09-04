import express from 'express';
import cors from 'cors';
import { db } from './db';
import { teams } from '../shared/schema';
import { desc } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Submit team completion time
app.post('/api/teams', async (req, res) => {
  try {
    const { teamName, completionTime, riddlesSolved } = req.body;
    
    if (!teamName || !completionTime) {
      return res.status(400).json({ error: 'Team name and completion time are required' });
    }

    const newTeam = await db.insert(teams).values({
      teamName,
      completionTime,
      riddlesSolved: riddlesSolved || 3
    }).returning();

    res.json({ success: true, team: newTeam[0] });
  } catch (error) {
    console.error('Error saving team:', error);
    res.status(500).json({ error: 'Failed to save team data' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.select().from(teams).orderBy(desc(teams.completionTime));
    
    // Sort by completion time (fastest first)
    const sortedLeaderboard = leaderboard.sort((a, b) => a.completionTime - b.completionTime);
    
    res.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Admin route to clear leaderboard (optional)
app.delete('/api/admin/clear-leaderboard', async (req, res) => {
  try {
    await db.delete(teams);
    res.json({ success: true, message: 'Leaderboard cleared' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    res.status(500).json({ error: 'Failed to clear leaderboard' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});