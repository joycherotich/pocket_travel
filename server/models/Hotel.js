import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  location:    { type: String },
  stars:       { type: Number, default: 3, min: 1, max: 5 },
  price:       { type: Number },         // price per night
  rooms:       { type: Number },         // total rooms available
  description: { type: String },
  images:      [{ type: String }],       // array of image URLs
  amenities:   [{ type: String }],       // e.g. ["wifi", "pool", "gym"]
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });


export default mongoose.model("Hotel", hotelSchema);  
