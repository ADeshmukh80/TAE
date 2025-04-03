const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Necessary for JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/industrialVisit', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Define Schema
const userSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,
    department: String,
    year: String,
    contactNumber: String,
    email: String,
    registrationDate: { type: Date, default: Date.now }
});

const Users = mongoose.model("Users", userSchema);

// Serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/register', async (req, res) => {
    try {
        console.log("Received data:", req.body);  // Debugging: Check received data

        const { name, rollNumber, department, year, contactNumber, email } = req.body;
        const user = new Users({
            name,
            rollNumber,
            department,
            year,
            contactNumber,
            email
        });

        await user.save();
        console.log("Saved user:", user);  // Debugging: Confirm data is saved

        res.send("Form Submission Successful.");
    } catch (error) {
        console.error("Error saving to MongoDB:", error);
        res.status(500).send("Error saving data.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
