import express from 'express';
import mongoose from 'mongoose';

const signnRouter = express.Router();
const signinCollectionName = "signin-collection";  
const signinSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { strict: false });  
const SigninModel = mongoose.model(signinCollectionName, signinSchema);

signnRouter.get("/", async (req, res) => {
    try {
        const data = await SigninModel.find({});
        console.log("data in singin==",data);
        res.json(data);
    } catch (error) {
        console.error("Unable to get the data from project API GET method:", error);
        res.status(500).json({ message: "Unable to get the data", error });
    }
});

signnRouter.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existedUser = await SigninModel.findOne({ username });
        if (existedUser) {
            return res.status(409).json({ message: "User already present with the entered username" });
        }
        const newSignin = await SigninModel.create({ username, password });
        res.status(201).json({ message: "New signin added successfully", newSignin });
    } catch (error) {
        console.error("Error while posting the data to signin collection:", error);
        res.status(500).json({ message: "Error while inserting data into signin DB", error });
    }
});

signnRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { password } = req.body;
        console.log("password to update==",password);
        const updatedPwd = await SigninModel.findByIdAndUpdate(id, { password }, { new: true });
        console.log("updated pwdd=",updatedPwd);
        if (updatedPwd) {
            return res.status(200).json({ message: "Password updated successfully" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error while updating the password in the signin collection:", error);
        res.status(500).json({ message: "Error while updating the password in signin DB", error });
    }
});


export default signnRouter;
