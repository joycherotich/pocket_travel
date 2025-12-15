import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotelId: { type: String, required: true },
  hotelName: { type: String },
  checkIn: Date,
  checkOut: Date,
  guests: { type: Number, default: 1 },
  totalPrice: Number,
  currency: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending","confirmed","cancelled"], default: "pending" }
});

export default mongoose.model("Booking", bookingSchema);
