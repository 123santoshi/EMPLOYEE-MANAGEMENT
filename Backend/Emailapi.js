import express from 'express';
import mongoose from 'mongoose';

const emailRouter = express.Router();

const emailCollectionName = "emails-collection";
const emailSchema = new mongoose.Schema({
  from_email: { type: String, required: true },
  to_email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  dateadntime: { type: Date, default: Date.now }
}, { strict: false });

const EmailsModel = mongoose.model(emailCollectionName, emailSchema);

emailRouter.get("/", async (req, res) => {
  try {
    const data = await EmailsModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Unable to get the data from email API GET method:", error);
    res.status(500).json({ message: "Unable to get the data", error });
  }
});

emailRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newEmail = await EmailsModel.create(data);
    res.status(201).json({ message: "Data inserted successfully", newEmail });
  } catch (error) {
    console.error("Error while posting the data to email collection:", error);
    res.status(500).json({ message: "Error while inserting data into email DB", error });
  }
});

export default emailRouter;
