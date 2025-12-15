import mongoose from "mongoose";

const hotelCacheSchema = new mongoose.Schema({
  destId: String,
  paramsHash: String,
  response: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("HotelCache", hotelCacheSchema);
