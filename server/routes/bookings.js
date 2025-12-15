import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { createBooking, getMyBookings, listAllBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.get("/", protect, restrictTo("admin","staff"), listAllBookings);

export default router;
