import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

/* ── GET /api/bookings ── all bookings (admin/staff) ── */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("client",    "name email")
      .populate("user",      "name email")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/bookings/my ── customer's own bookings ── */
router.get("/my", async (req, res) => {
  try {
    // requires auth middleware — req.user set by protect()
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/bookings/:id ── single booking ── */
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("user",   "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/bookings ── create booking ── */
router.post("/", async (req, res) => {
  try {
    const {
      clientName, client, destination, date,
      hotelId, hotelName, checkIn, checkOut,
      guests, totalPrice, currency, notes, status,
    } = req.body;

    if (!clientName && !client) {
      return res.status(400).json({ message: "Client name or client ID is required" });
    }

    const booking = await Booking.create({
      clientName,
      client:      client      || null,
      user:        req.user    ? req.user._id : null,
      createdBy:   req.user    ? req.user._id : null,
      destination,
      date:        date        ? new Date(date) : null,
      hotelId,
      hotelName,
      checkIn:     checkIn     ? new Date(checkIn)  : null,
      checkOut:    checkOut    ? new Date(checkOut) : null,
      guests:      guests      || 1,
      totalPrice,
      currency:    currency    || "USD",
      notes,
      status:      status      || "Pending",
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── PATCH /api/bookings/:id ── update status ── */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,          // allow updating any field
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── PUT /api/bookings/:id ── full update ── */
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE /api/bookings/:id ── delete booking ── */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;