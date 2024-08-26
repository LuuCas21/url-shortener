import mongoose from "mongoose";

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log('Connected to the database');
    } catch(err) {
        console.log('Failed to connect to the database: ' + err);
        process.exit(1);
    }
}

export default connectDB;