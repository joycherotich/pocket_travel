/**
 * Commissions Route — server/routes/commissions.js
 *
 * GET  /api/commissions/staff        → all staff with client + booking summary
 * GET  /api/commissions/staff/:id    → one staff's clients + bookings detail
 * POST /api/commissions/staff/:id/rate → set custom commission rate
 *
 * Field mapping (from actual models):
 *   Client.assignedTo  → staff user ID
 *   Booking.client     → client ID
 *   Booking.totalPrice → booking value
 *   Booking.status     → "Pending" | "Confirmed" | "Completed" | "Cancelled"
 */

import express from "express";
import User    from "../models/User.js";
import Client  from "../models/Client.js";
import Booking from "../models/Booking.js";

const router = express.Router();

const STAFF_ROLES   = ["staff", "finance"];
const DEFAULT_RATE  = 0.10; // 10%
const PAID_STATUSES = ["Completed"];  // only these count toward commission

// resolve role whether stored as string or populated object
const getRole = (u) =>
  (typeof u.role === "object" ? u.role?.name : u.role) ?? "";

// ── GET /api/commissions/staff ────────────────────────────────────────────────
router.get("/staff", async (req, res) => {
  try {
    const allUsers = await User.find().lean();
    const staff    = allUsers.filter(u =>
      STAFF_ROLES.includes(getRole(u).toLowerCase())
    );

    const summaries = await Promise.all(staff.map(async (s) => {
      // clients where assignedTo = this staff member
      const myClients  = await Client.find({ assignedTo: s._id }).lean();
      const clientIds  = myClients.map(c => c._id);

      // all bookings for those clients
      const myBookings = await Booking.find({ client: { $in: clientIds } }).lean();

      const completedRevenue = myBookings
        .filter(b => PAID_STATUSES.includes(b.status))
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      const rate       = s.commissionRate ?? DEFAULT_RATE;
      const commission = completedRevenue * rate;

      return {
        _id:               s._id,
        name:              s.name,
        email:             s.email,
        role:              getRole(s),
        commissionRate:    rate,
        clientCount:       myClients.length,
        completedBookings: myBookings.filter(b => b.status === "Completed").length,
        confirmedBookings: myBookings.filter(b => b.status === "Confirmed").length,
        pendingBookings:   myBookings.filter(b => b.status === "Pending").length,
        cancelledBookings: myBookings.filter(b => b.status === "Cancelled").length,
        totalRevenue:      completedRevenue,
        totalCommission:   commission,
      };
    }));

    res.json(summaries);
  } catch (err) {
    console.error("commissions/staff error:", err);
    res.status(500).json({ message: "Failed to load staff commissions" });
  }
});

// ── GET /api/commissions/staff/:id ───────────────────────────────────────────
router.get("/staff/:id", async (req, res) => {
  try {
    const staffUser = await User.findById(req.params.id).lean();
    if (!staffUser) return res.status(404).json({ message: "Staff not found" });

    // clients assigned to this staff member
    const myClients = await Client.find({ assignedTo: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    // attach bookings to each client
    const clientsWithBookings = await Promise.all(myClients.map(async (c) => {
      const bks = await Booking.find({ client: c._id })
        .sort({ createdAt: -1 })
        .lean();
      return { ...c, bookings: bks };
    }));

    res.json({
      staff: {
        _id:            staffUser._id,
        name:           staffUser.name,
        email:          staffUser.email,
        role:           getRole(staffUser),
        commissionRate: staffUser.commissionRate ?? DEFAULT_RATE,
      },
      clients: clientsWithBookings,
    });
  } catch (err) {
    console.error("commissions/staff/:id error:", err);
    res.status(500).json({ message: "Failed to load staff detail" });
  }
});

// ── POST /api/commissions/staff/:id/rate ─────────────────────────────────────
router.post("/staff/:id/rate", async (req, res) => {
  const { rate } = req.body;
  if (rate == null || rate < 0 || rate > 1)
    return res.status(400).json({ message: "Rate must be between 0 and 1 (e.g. 0.10 for 10%)" });
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { commissionRate: rate },
      { new: true }
    );
    res.json({ _id: updated._id, commissionRate: updated.commissionRate });
  } catch (err) {
    res.status(500).json({ message: "Failed to update rate" });
  }
});

export default router;