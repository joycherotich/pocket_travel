import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Internal booking (staff/admin creates for a client)
  clientName:  { type: String },
  client:      { type: mongoose.Schema.Types.ObjectId, ref: "Client" },

  // External booking (customer books a hotel)
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hotelId:     { type: String },
  hotelName:   { type: String },

  destination: { type: String },
  date:        { type: Date },
  checkIn:     { type: Date },
  checkOut:    { type: Date },
  guests:      { type: Number, default: 1 },
  totalPrice:  { type: Number },
  currency:    { type: String, default: "USD" },
  notes:       { type: String },

  status: {
    type:    String,
    enum:    ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff who created
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);