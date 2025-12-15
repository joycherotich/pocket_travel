import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Pass plain password here
    const user = await User.create({
      name: "Joy Admin",
      email: "letimjoy7@gmail.com",
      password: "cherotich",  // Plain password
      role: "admin",
    });

    console.log("User created:", user);
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


createUser();
