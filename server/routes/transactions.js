/**
 * server/routes/transactions.js
 *
 * POST /api/transactions/stk-push      → initiate Daraja STK push
 * POST /api/transactions/manual        → record manual paybill payment
 * POST /api/transactions/mpesa-callback → Safaricom callback (no auth)
 * GET  /api/transactions               → list all (admin/staff)
 * GET  /api/transactions/my            → customer's own transactions
 * GET  /api/transactions/:id           → single transaction
 * PATCH /api/transactions/:id/refund   → mark refunded (admin)
 * GET  /api/transactions/summary       → stats for dashboard
 */

import express from "express";
import Transaction from "../models/Transaction.js";
import Booking     from "../models/Booking.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { paymentRateLimiter, auditLog } from "../middleware/security.js";
import { stkPush, isSafaricomIP } from "../utils/mpesa.js";

const router = express.Router();

/* ══════════════════════════════════════════════════════════════
   1. STK PUSH  —  POST /api/transactions/stk-push
   ══════════════════════════════════════════════════════════════ */
router.post(
  "/stk-push",
  protect,
  paymentRateLimiter,
  auditLog,
  async (req, res) => {
    try {
      const {
        phone,
        amount,
        bookingId,
        clientName,
        clientId,
        accountReference,
        description,
        commissionRate,
        commissionPaidTo,
      } = req.body;

      if (!phone || !amount)
        return res.status(400).json({ message: "phone and amount are required" });

      // Normalise phone → 2547XXXXXXXX
      const normalisedPhone = phone
        .replace(/\s+/g, "")
        .replace(/^\+/, "")
        .replace(/^0/, "254");

      // Call Daraja
      const darajaRes = await stkPush({
        phone:      normalisedPhone,
        amount,
        accountRef: accountReference || bookingId || "BOOKING",
        description: description || "Travel Payment",
      });

      if (darajaRes.ResponseCode !== "0") {
        return res.status(502).json({
          message: "STK push failed",
          detail:  darajaRes.ResponseDescription,
        });
      }

      // Determine commission
      const rate       = commissionRate ?? 0.10;
      const commission = parseFloat((amount * rate).toFixed(2));

      // Persist pending transaction
      const txn = await Transaction.create({
        paidBy:           req.user._id,
        clientName:       clientName || null,
        client:           clientId   || null,
        booking:          bookingId  || null,
        method:           "mpesa_stk",
        phone:            normalisedPhone,
        paybillNumber:    process.env.MPESA_SHORTCODE,
        accountReference: accountReference || bookingId || "BOOKING",
        amount,
        currency:         "KES",
        checkoutRequestId:  darajaRes.CheckoutRequestID,
        merchantRequestId:  darajaRes.MerchantRequestID,
        status:           "pending",
        commissionRate:   rate,
        commissionAmount: commission,
        commissionPaidTo: commissionPaidTo || null,
        createdBy:        req.user._id,
        ipAddress:        req.clientIp,
        userAgent:        req.clientAgent,
      });

      res.status(201).json({
        message:          "STK push sent. Ask customer to check their phone.",
        transactionId:    txn._id,
        checkoutRequestId: darajaRes.CheckoutRequestID,
        customerMessage:   darajaRes.CustomerMessage,
      });
    } catch (err) {
      console.error("STK push error:", err.response?.data || err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ══════════════════════════════════════════════════════════════
   2. MANUAL ENTRY  —  POST /api/transactions/manual
   ══════════════════════════════════════════════════════════════ */
router.post(
  "/manual",
  protect,
  paymentRateLimiter,
  auditLog,
  async (req, res) => {
    try {
      const {
        mpesaReceiptNumber,
        phone,
        amount,
        bookingId,
        clientName,
        clientId,
        accountReference,
        commissionRate,
        commissionPaidTo,
      } = req.body;

      if (!mpesaReceiptNumber || !amount)
        return res
          .status(400)
          .json({ message: "mpesaReceiptNumber and amount are required" });

      // Prevent duplicate receipt codes
      const exists = await Transaction.findOne({ mpesaReceiptNumber });
      if (exists)
        return res.status(409).json({ message: "Receipt code already recorded" });

      const rate       = commissionRate ?? 0.10;
      const commission = parseFloat((amount * rate).toFixed(2));

      const txn = await Transaction.create({
        paidBy:           req.user._id,
        clientName:       clientName || null,
        client:           clientId   || null,
        booking:          bookingId  || null,
        method:           "mpesa_manual",
        phone:            phone || null,
        paybillNumber:    process.env.MPESA_SHORTCODE,
        accountReference: accountReference || "MANUAL",
        amount,
        currency:         "KES",
        mpesaReceiptNumber,
        status:           "confirmed",   // manual entry = already confirmed
        commissionRate:   rate,
        commissionAmount: commission,
        commissionPaidTo: commissionPaidTo || null,
        createdBy:        req.user._id,
        ipAddress:        req.clientIp,
        userAgent:        req.clientAgent,
      });

      // Auto-confirm linked booking if present
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { status: "Confirmed" });
      }

      res.status(201).json({ message: "Transaction recorded", transaction: txn });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ══════════════════════════════════════════════════════════════
   3. SAFARICOM CALLBACK  —  POST /api/transactions/mpesa-callback
   No JWT auth — Safaricom calls this directly
   ══════════════════════════════════════════════════════════════ */
router.post("/mpesa-callback", auditLog, async (req, res) => {
  // Optional IP whitelist
  if (!isSafaricomIP(req.clientIp)) {
    console.warn("Callback from unknown IP:", req.clientIp);
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ message: "Invalid payload" });

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } =
      callback;

    const txn = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!txn) {
      console.warn("No transaction for CheckoutRequestID:", CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (ResultCode === 0) {
      // Success — extract receipt number & amount from metadata
      const items = CallbackMetadata?.Item || [];
      const get   = (name) => items.find((i) => i.Name === name)?.Value;

      txn.status             = "confirmed";
      txn.mpesaReceiptNumber = get("MpesaReceiptNumber") || txn.mpesaReceiptNumber;
      const paidAmount       = get("Amount");
      if (paidAmount) txn.amount = paidAmount;

      await txn.save();

      // Auto-confirm linked booking
      if (txn.booking) {
        await Booking.findByIdAndUpdate(txn.booking, { status: "Confirmed" });
      }
    } else {
      txn.status        = "failed";
      txn.failureReason = ResultDesc;
      await txn.save();
    }

    // Always respond 200 to Safaricom
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err.message);
    res.status(500).json({ message: "Callback processing error" });
  }
});

/* ══════════════════════════════════════════════════════════════
   4. LIST ALL  —  GET /api/transactions
   ══════════════════════════════════════════════════════════════ */
router.get("/", protect, restrictTo("admin", "staff"), async (req, res) => {
  try {
    const { status, method, from, to, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (method) filter.method = method;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .populate("paidBy",          "name email")
      .populate("client",          "name email")
      .populate("booking",         "destination date status totalPrice")
      .populate("commissionPaidTo","name email")
      .populate("createdBy",       "name")
      .populate("refundedBy",      "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ══════════════════════════════════════════════════════════════
   5. MY TRANSACTIONS  —  GET /api/transactions/my
   ══════════════════════════════════════════════════════════════ */
router.get("/my", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ paidBy: req.user._id })
      .populate("booking", "destination date status")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ══════════════════════════════════════════════════════════════
   6. SUMMARY STATS  —  GET /api/transactions/summary
   ══════════════════════════════════════════════════════════════ */
router.get("/summary", protect, restrictTo("admin", "staff"), async (req, res) => {
  try {
    const [result] = await Transaction.aggregate([
      {
        $group: {
          _id:                null,
          totalRevenue:       { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, "$amount", 0] } },
          totalCommission:    { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, "$commissionAmount", 0] } },
          totalPending:       { $sum: { $cond: [{ $eq: ["$status", "pending"]   }, 1, 0] } },
          totalConfirmed:     { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          totalFailed:        { $sum: { $cond: [{ $eq: ["$status", "failed"]    }, 1, 0] } },
          totalRefunded:      { $sum: { $cond: [{ $eq: ["$status", "refunded"]  }, 1, 0] } },
          count:              { $sum: 1 },
        },
      },
    ]);

    res.json(result || {
      totalRevenue: 0, totalCommission: 0,
      totalPending: 0, totalConfirmed: 0, totalFailed: 0, totalRefunded: 0, count: 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ══════════════════════════════════════════════════════════════
   7. SINGLE  —  GET /api/transactions/:id
   ══════════════════════════════════════════════════════════════ */
router.get("/:id", protect, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate("paidBy",           "name email")
      .populate("client",           "name email phone")
      .populate("booking",          "destination date status totalPrice hotelName")
      .populate("commissionPaidTo", "name email")
      .populate("createdBy",        "name email")
      .populate("refundedBy",       "name email");

    if (!txn) return res.status(404).json({ message: "Transaction not found" });
    res.json(txn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ══════════════════════════════════════════════════════════════
   8. REFUND  —  PATCH /api/transactions/:id/refund
   ══════════════════════════════════════════════════════════════ */
router.patch(
  "/:id/refund",
  protect,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const { refundNote } = req.body;

      const txn = await Transaction.findById(req.params.id);
      if (!txn) return res.status(404).json({ message: "Transaction not found" });

      if (txn.status !== "confirmed")
        return res.status(400).json({ message: "Only confirmed transactions can be refunded" });

      txn.status      = "refunded";
      txn.refundedAt  = new Date();
      txn.refundedBy  = req.user._id;
      txn.refundNote  = refundNote || "";
      await txn.save();

      res.json({ message: "Transaction marked as refunded", transaction: txn });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;