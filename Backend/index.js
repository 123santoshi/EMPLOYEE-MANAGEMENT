import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import teamsRoutes from '../Backend/Teamapi.js';
import emailRoutes from "../Backend/Emailapi.js";
import projectRoutes from "../Backend/Projectapi.js";
import signinRoutes from "../Backend/Signinapi.js";

import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const port = 7000;
const mongourl = 'mongodb://localhost:27017/Timechamp';
const authtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI4ZDRkZTFiZS03MWU3LTRkZGYtYjc2OS05MWIyNmZhOTNlNzciLCJDb21wYW55IjoiMWYzYTAyNmUtOGRmNC00ZWVjLThhYzgtYjZkYTc3NzA1ZjI0IiwibmJmIjoxNzIxMDE2MTQzLCJleHAiOjIxNTMwMTYxNDMsImlhdCI6MTcyMTAxNjE0M30.pMhsp_5cvoiKr50PKt2lxmh9R5NGsPweogb2_C8zlxQ';
const api = 'https://project.v3.timechamp.io/backend/ActivityTracker/ActivityTrackerApi/GetTrackingSummaryData?Date=2023-07-01';

const collectionName = 'hubspot_datas';
const dynamicSchema = new mongoose.Schema({}, { strict: false });
const DynamicModel = mongoose.model(collectionName, dynamicSchema);

let dataToInsert = [];
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB server is connected');
        app.listen(port, () => {
            console.log(`Server is running on port number ${port}`);
        });
        fetchDataAndStoreInDB();
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));

const fetchDataAndStoreInDB = async () => {
    try {
        const response = await axios.get(api, {
            headers: {
                Authorization: `Bearer ${authtoken}`
            }
        });

        dataToInsert = response.data;
        if (dataToInsert.data && Array.isArray(dataToInsert.data)) {
            dataToInsert.data = dataToInsert.data.map(record => ({
                ...record,
                teams: record.teams !== undefined ? record.teams : null,
                dateOfJoining: record.dateOfJoining !== undefined ? record.dateOfJoining : null,
                designation: record.designation !== undefined ? record.designation : null,
                employment_type: record.employment_type !== undefined ? record.employment_type : null,
                mobile_number: record.mobile_number !== undefined ? record.mobile_number : null,
                alternative_email: record.alternative_email !== undefined ? record.alternative_email : null,
                address: record.address !== undefined ? record.address : null,
                gender: record.gender !== undefined ? record.gender : null,
                date_of_birth: record.date_of_birth !== undefined ? record.date_of_birth: null
            }));
        }
        

        console.log('Processed data to insert:', dataToInsert);

        const count = await DynamicModel.countDocuments();
        console.log('Number of records in DB:', count);

        if (count === 0) {
            await DynamicModel.insertMany(dataToInsert.data);
            console.log('Data fetched and saved to MongoDB');
        } else {
            console.log('Data already exists in MongoDB or data format is incorrect');
        }
    } catch (error) {
        console.error('Error fetching data from API or saving to MongoDB:', error);
    }
};

// Example endpoint to retrieve data from MongoDB
app.get('/get-data', async (req, res) => {
    try {
        const data = await DynamicModel.find({});
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get("/users", async (req, res) => {
    try {
        const usersdata = await DynamicModel.find({});
        const usernames = usersdata.map(user => user.name); 
        res.json({ usernames: usernames });
    } catch (error) {
        console.log("Error while getting the users list:", error);
        res.status(500).json({ message: "Error while getting the users list", error: error });
    }
});



app.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await DynamicModel.findOne({ "empID": id });
       
        console.log("data==", data);
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Data not found with that ID');
        }
    } catch (error) {
        console.error('Error while fetching data by ID:', error);
        res.status(500).send('Error fetching data by ID');
    }
});

// Inserting new record
app.post('/', async (req, res) => {
    try {
        const data = req.body;
        const existingRecord = await DynamicModel.findOne({ empID: data.empID });

        if (existingRecord) {
            res.status(400).json({ message: 'empID already exists' });
        } else {
            const newRecord = new DynamicModel(data);
            const result = await newRecord.save();
            res.status(200).json({ message: 'Data inserted successfully', data: result });
        }
    } catch (error) {
        console.error('Error while inserting data:', error);
        res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
});

// Update the record based on ID
app.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const result = await DynamicModel.updateOne(
            { empID: id },
            { $set: updateData }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Record updated successfully' });
          
            
        } else {
            res.status(400).json({ message: 'Record update failed' });
        }
    } catch (error) {
        console.error('Error while updating the record:', error);
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

// Deleting the record
app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await DynamicModel.deleteOne({ empID: id });
        console.log('After deletion:', result);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'ID not found' });
        }
    } catch (error) {
        console.error('Error while deleting the data by ID:', error);
        res.status(500).json({ message: 'Error deleting data', error: error.message });
    }
});






// Use team routes
app.use('/api/teams', teamsRoutes);
app.post('/api/teams', teamsRoutes);
app.put('/api/teams/:id', teamsRoutes);
app.delete('/api/teams/:id', teamsRoutes);


//use email routes
app.use("/api/email", emailRoutes);
app.post("/api/email", emailRoutes);

app.use("/api/project",projectRoutes);
app.post("/api/project",projectRoutes);
app.get("/api/project/:id",projectRoutes);
app.put("/api/project/:id",projectRoutes);
app.delete("/api/project/:id",projectRoutes);



app.use("/api/signin",signinRoutes);
app.post("/api/signin",signinRoutes);
app.put("/api/signin/:id",signinRoutes);




export default app;
