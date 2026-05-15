const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000', // allow requests from this origin
    credentials: true, // allow cookies to be sent
}))

// middleware to change req.body to a json object
app.use(express.json());

// middleware to change req.body to a urlencoded object
app.use(express.urlencoded({ extended: true }));

// use auth routes
app.use('/api/auth', authRoutes);

// use user routes
app.use('/api/user', userRoutes);

// route to test if server is working
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})