import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "/var/www/html/TRAVEL/travel-agency/server/.env" });

await mongoose.connect(process.env.MONGO_URI);
const collections = await mongoose.connection.db.listCollections().toArray();
console.log("✅ Collections in DB:");
collections.forEach(c => console.log("  →", c.name));
await mongoose.disconnect();
