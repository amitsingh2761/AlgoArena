require("dotenv").config();


const mongoose = require("mongoose")


const connectDB = async () => {
    try {

        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected")
    } catch (error) {
        console.log("=================Error connecting to DataBase==================", error.message)
        process.exit();
    }
}

module.exports = connectDB;