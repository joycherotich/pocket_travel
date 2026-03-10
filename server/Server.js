import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { seedAdminRole } from "./config/seedAdmin.js";

// Routes
import authRoutes     from "./routes/auth.js";
import userRoutes     from "./routes/users.js";
import roleRoutes     from "./routes/roles.js";
import clientRoutes   from "./routes/clients.js";
import bookingRoutes  from "./routes/bookings.js";
import hotelRoutes    from "./routes/hotels.js";
import packageRoutes  from "./routes/packages.js";
import hotelSearchRoutes from "./routes/hotelSearch.js";


// 1️⃣ Load env FIRST
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// 2️⃣ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 3️⃣ Routes
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/roles",    roleRoutes);
app.use("/api/clients",  clientRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels",   hotelRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/hotel-search", hotelSearchRoutes);
// 4️⃣ Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 5️⃣ Connect DB then start server
connectDB()
  .then(async () => {
    await seedAdminRole();
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });