const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : ""

        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables")
        }

        await mongoose.connect(uri)
        console.log("MongoDB connected")

    } catch (err) {
        console.error("Database connection failed:", err.message)
        process.exit(1)
    }
} 

module.exports = connectDB