import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { hotelId, hotelName, checkIn, checkOut, guests, totalPrice, currency } = req.body;

    const booking = await Booking.create({
      user: userId,
      hotelId,
      hotelName,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      currency
    });

    res.json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking creation failed", error: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Admin: list all bookings
export const listAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
