import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

/* ── GET /api/hotels ── list all hotels ── */
router.get("/", async (req, res) => {
  try {
    const { search, stars, minPrice, maxPrice } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name:     { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (stars)    query.stars = Number(stars);
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/hotels/:id ── single hotel ── */
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/hotels ── create hotel (admin only) ── */
router.post("/", async (req, res) => {
  try {
    const { name, location, stars, price, rooms, description, amenities, images } = req.body;

    if (!name) return res.status(400).json({ message: "Hotel name is required" });

    const hotel = await Hotel.create({
      name,
      location,
      stars:       stars       ? Number(stars)  : 3,
      price:       price       ? Number(price)  : null,
      rooms:       rooms       ? Number(rooms)  : null,
      description,
      amenities:   amenities   || [],
      images:      images      || [],
    });

    res.status(201).json({ message: "Hotel created", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── PUT /api/hotels/:id ── update hotel ── */
router.put("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel updated", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE /api/hotels/:id ── delete hotel ── */
router.delete("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;