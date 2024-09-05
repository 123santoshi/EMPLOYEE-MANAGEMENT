import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const teamcollectionName = 'team-collection';
const teamsSchema = new mongoose.Schema({ teamname: String }, { strict: false });
const teamsModel = mongoose.model(teamcollectionName, teamsSchema);

// Endpoint to retrieve teams data
router.get('/', async (req, res) => {
    try {
        console.log("Teams GET method is called");
        const getTeams = await teamsModel.find();
        res.json({ teams: getTeams });
    } catch (error) {
        console.error('Error fetching teams data:', error);
        res.status(500).json({ message: 'Error fetching teams data', error });
    }
});

// Inserting new teams
router.post('/', async (req, res) => {
    try {
        const { teamname } = req.body;
        if (!teamname) {
            return res.status(400).json({ message: 'Team name is required' });
        }

        const existingTeam = await teamsModel.findOne({ teamname });
        if (existingTeam) {
            return res.status(400).json({ message: 'Record already exists with that team name' });
        } else {
            const newTeam = new teamsModel({ teamname });
            const savedTeam = await newTeam.save();
            res.status(200).json({ message: 'Team added successfully', team: savedTeam });
        }
    } catch (error) {
        console.error('Error adding team:', error);
        res.status(500).json({ message: 'Error adding team', error: error.message });
    }
});

// Delete the team
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const existingTeam = await teamsModel.findById(id);
        if (existingTeam) {
            await teamsModel.findByIdAndDelete(id);
            res.status(200).json({ message: 'Record deleted successfully' });
        } else {
            res.status(404).json({ message: 'ID not found for deletion' });
        }
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
});

// Updating the team name
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { teamname } = req.body;
        if (!teamname) {
            return res.status(400).json({ message: 'Team name is required' });
        }
        
        const result = await teamsModel.findByIdAndUpdate(
            id,
            { teamname },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Team updated successfully', team: result });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        console.error('Error updating team name:', error);
        res.status(500).json({ message: 'Error updating team name', error: error.message });
    }
});

export default router;