import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import hotelsRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";
import rolesRoutes from "./routes/roles.js";
import usersRoutes from "./routes/users.js";
import packageRoutes from "./routes/packages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
