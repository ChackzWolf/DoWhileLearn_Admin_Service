import mongoose from "mongoose";
import "dotenv/config";
  
const connectDB = async () => {
  try { 
    if (!process.env.MONGODB_URL_TUTOR) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    console.log(process.env.MONGODB_URL_TUTOR)

    await mongoose.connect(process.env.MONGODB_URL_TUTOR);
    console.log("Tutor Service Database connected");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}; 

export { connectDB };  