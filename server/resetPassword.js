import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust path as needed
import dotenv from "dotenv";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "cherotich";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email: "letimjoy7@gmail.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (updatedUser) {
      console.log("Password reset for user:", updatedUser.email);
    } else {
      console.log("User not found");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};

resetPassword();
