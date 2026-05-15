import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // ── Parties ──────────────────────────────────────────────
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,        // null when staff pays on behalf of a walk-in client
    },
    clientName: { type: String },          // walk-in / manual label
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },

    // ── Linked booking ───────────────────────────────────────
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    // ── Payment details ──────────────────────────────────────
    method: {
      type: String,
      enum: ["mpesa_stk", "mpesa_manual"],
      required: true,
    },
    phone: { type: String },               // payer phone number
    paybillNumber: { type: String },       // your business paybill
    accountReference: { type: String },    // e.g. booking ID or client name

    amount: { type: Number, required: true },
    currency: { type: String, default: "KES" },

    // ── M-Pesa identifiers ───────────────────────────────────
    mpesaReceiptNumber: { type: String },  // confirmation code e.g. QHF3XXXXXX
    checkoutRequestId: { type: String },   // STK push request ID from Daraja
    merchantRequestId: { type: String },

    // ── Status ───────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "refunded"],
      default: "pending",
    },
    failureReason: { type: String },

    // ── Refund ───────────────────────────────────────────────
    refundedAt: { type: Date },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    refundNote: { type: String },

    // ── Commission ───────────────────────────────────────────
    commissionRate: { type: Number, default: 0.10 },
    commissionAmount: { type: Number, default: 0 },
    commissionPaidTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Audit ────────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast lookups
transactionSchema.index({ booking: 1 });
transactionSchema.index({ paidBy: 1 });
transactionSchema.index({ mpesaReceiptNumber: 1 }, { sparse: true });
transactionSchema.index({ checkoutRequestId: 1 }, { sparse: true });
transactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);