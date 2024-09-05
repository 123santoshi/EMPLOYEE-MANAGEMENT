import express from 'express';
import mongoose from 'mongoose';

const projectRouter = express.Router();

const projectCollectionName = "projects-collection";

// Define project schema
const projectSchema = new mongoose.Schema({
  taskname: { type: String, required: true },
  owner: { type: String, required: true },
  taskstatus: { type: String},
  createddate: { type: Date, default: Date.now }
}, { strict: false });

const ProjectModel = mongoose.model(projectCollectionName, projectSchema);

// Define routes for projects
projectRouter.get("/", async (req, res) => {
  try {
    const data = await ProjectModel.find({});
    res.json(data);
  } catch (error) {
    console.error("Unable to get the data from project API GET method:", error);
    res.status(500).json({ message: "Unable to get the data", error });
  }
});

projectRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("req body==", data);
    const newProject = await ProjectModel.create(data);
    console.log("newprojectadded==",newProject);
    res.status(201).json({ message: "Data inserted successfully", newProject });
  } catch (error) {
    console.error("Error while posting the data to project collection:", error);
    res.status(500).json({ message: "Error while inserting data into project DB", error });
  }
});


projectRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingRecord = await ProjectModel.findById(id);
    if (!existingRecord) {
      return res.status(404).send("Unable to find the record for the given ID to update the task details");
    }

    const data = req.body;
    const result = await ProjectModel.updateOne({ _id: id }, { $set: data }); 
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Record updated successfully' });
    } else {
      res.status(400).json({ message: 'Record update failed' });
  }
  } catch (error) {
    console.error("Error while updating the data in the project collection:", error);
    res.status(500).json({ message: "Error while updating data in project DB", error });
  }
});

projectRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingRecord = await ProjectModel.findById(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Unable to find the record for the given ID" });
    }
    res.status(200).json(existingRecord);
  } catch (error) {
    console.error("Error while fetching the data from the project collection:", error);
    res.status(500).json({ message: "Error while fetching data from project DB", error });
  }
});

projectRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingRecord = await ProjectModel.findByIdAndDelete(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Unable to find the record with the given ID to delete the task" });
    } else {
      return res.status(200).json({ message: "Record deleted successfully" });
    }
  } catch (error) {
    console.log("Error while deleting the project based on id:", error);
    res.status(500).json({ message: "An error occurred while deleting the project" });
  }
});




export default projectRouter;
