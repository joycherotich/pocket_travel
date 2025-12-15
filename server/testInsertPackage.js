import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: String,
  price: Number,
  slots: Number,
  booked: Number,
  status: String,
  createdAt: Date,
});

const Package = mongoose.model("Package", packageSchema);

const run = async () => {
    await mongoose.connect("mongodb+srv://travel_admin:fJAuet0oZpAXBi1W@cluster0.nj2wfej.mongodb.net/travel_agency");

  const pkg = new Package({
    name: "Test Package",
    price: 1000,
    slots: 10,
    booked: 0,
    status: "Available",
    createdAt: new Date(),
  });

  await pkg.save();
  console.log("Inserted package", pkg);

  await mongoose.disconnect();
};

run();
