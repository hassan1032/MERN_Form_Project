import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("Database connection string (MONGO_URI or MONGODB_URI) is not defined in environment variables.");
        }
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log("❌ Database Connection Failed");

        console.log(error.message);

        process.exit(1);
    }
};

export default connectDB;