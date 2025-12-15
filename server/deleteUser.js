import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await User.deleteOne({ email: "letimjoy7@gmail.com" });
    console.log("Delete result:", result);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

deleteUser();
