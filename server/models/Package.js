import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  slots: { type: Number, required: true },
  booked: { type: Number, default: 0 },
  status: { type: String, enum: ["Available", "Full"], default: "Available" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Package", packageSchema);
