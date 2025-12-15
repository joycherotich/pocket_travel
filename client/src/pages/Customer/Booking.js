import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlaneDeparture, FaCalendarAlt, FaUsers, FaSuitcase } from "react-icons/fa";

export default function Booking() {
  const [form, setForm] = useState({
    destination: "",
    departureDate: "",
    returnDate: "",
    travelers: 1,
    travelClass: "economy",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="font-[Poppins] px-2 sm:px-4 md:px-8">
      {!submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center gap-3">
            <FaPlaneDeparture className="text-yellow-600" />
            Book Your Next Adventure
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Zanzibar, Nairobi, Cape Town"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
              />
            </div>

            {/* Departure & Return */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Departure Date
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    name="departureDate"
                    value={form.departureDate}
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Return Date
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Travelers & Class */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Number of Travelers
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5">
                  <FaUsers className="text-gray-400 mr-2" />
                  <input
                    type="number"
                    min="1"
                    name="travelers"
                    value={form.travelers}
                    onChange={handleChange}
                    className="w-full focus:outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Travel Class
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5">
                  <FaSuitcase className="text-gray-400 mr-2" />
                  <select
                    name="travelClass"
                    value={form.travelClass}
                    onChange={handleChange}
                    className="w-full focus:outline-none text-gray-700 bg-transparent"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Special Requests or Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="e.g. Prefer window seat, vegetarian meal..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition bg-transparent"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-10 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]"
            >
              Confirm Booking
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center mt-20"
        >
          <h2 className="text-3xl font-bold text-yellow-700 mb-3">
            🎉 Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            We’ve received your booking to <strong>{form.destination}</strong>.
            Our travel team will contact you shortly to finalize details.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Make Another Booking
          </button>
        </motion.div>
      )}
    </div>
  );
}
