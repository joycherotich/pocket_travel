import mongoose from "mongoose";
import { PRIVILEGES } from "../constants/privileges.js";

const roleSchema = new mongoose.Schema({
  name:       { type: String, required: true, unique: true },
  privileges: { type: [String], enum: PRIVILEGES, default: [] },
  reserved:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);