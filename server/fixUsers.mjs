import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected ✅");

// 1. Users missing the field entirely → set to false (they're existing active users)
const old = await mongoose.connection.collection("users").updateMany(
  { mustChangePassword: { $exists: false } },
  { $set: { mustChangePassword: false } }
);
console.log("Patched existing users:", old.modifiedCount);

// 2. Show all users so you can decide who needs mustChangePassword: true
const users = await mongoose.connection.collection("users").find({}).toArray();
console.log("\nAll users:");
users.forEach(u => {
  console.log(`  ${u.email} | mustChangePassword: ${u.mustChangePassword}`);
});

await mongoose.disconnect();
console.log("\nDone ✅ — manually set mustChangePassword: true for any user who hasn't logged in yet");
