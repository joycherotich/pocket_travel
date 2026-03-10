import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String },
  phone:       { type: String },
  destination: { type: String },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff member
  notes:       { type: String },
  status:      { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);