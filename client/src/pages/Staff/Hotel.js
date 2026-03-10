import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Hotel() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "", location: "", stars: "3", price: "", rooms: "", description: "",
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/hotels");
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filtered = hotels.filter((h) =>
    h.name && h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/hotels", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed"); return; }
      toast.success("Hotel added ✅");
      setModalOpen(false);
      setForm({ name: "", location: "", stars: "3", price: "", rooms: "", description: "" });
      fetchHotels();
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await fetch("http://localhost:5000/api/hotels/" + id, { method: "DELETE" });
      toast.success("Hotel deleted");
      fetchHotels();
    } catch {
      toast.error("Delete failed");
    }
  };

  const renderStars = (count) => "⭐".repeat(Number(count) || 0);

  return (
    <div className="font-[Poppins] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hotels</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isAdmin ? "Manage hotel partners" : "View available hotels"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow transition"
            >
              + Add Hotel
            </button>
          )}
        </div>
      </div>

      {/* Hotel Cards */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading hotels...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 italic py-10">No hotels found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h, i) => (
            <div
              key={h._id || i}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Placeholder image */}
              <div className="h-36 bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-5xl">
                🏨
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-base">{h.name}</h3>
                  <span className="text-xs">{renderStars(h.stars)}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">📍 {h.location || "—"}</p>
                {h.description && (
                  <p className="text-gray-600 text-xs mt-2 line-clamp-2">{h.description}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                  <div>
                    {h.price && (
                      <span className="text-yellow-700 font-bold text-sm">${h.price}<span className="text-gray-400 font-normal">/night</span></span>
                    )}
                  </div>
                  {h.rooms && (
                    <span className="text-xs text-gray-400">{h.rooms} rooms</span>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => toast("Edit coming soon")}
                      className="flex-1 text-xs text-yellow-600 hover:text-yellow-800 font-semibold border border-yellow-200 hover:border-yellow-400 rounded-lg py-1.5 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="flex-1 text-xs text-red-500 hover:text-red-700 font-semibold border border-red-100 hover:border-red-300 rounded-lg py-1.5 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Hotel Modal — admin only */}
      {modalOpen && isAdmin && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-yellow-700 mb-4">Add New Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text" placeholder="Hotel Name" required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text" placeholder="Location"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <div className="flex gap-3">
                <select
                  value={form.stars}
                  onChange={(e) => setForm((p) => ({ ...p, stars: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {["1","2","3","4","5"].map((s) => (
                    <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>
                  ))}
                </select>
                <input
                  type="number" placeholder="Price/night"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <input
                type="number" placeholder="Number of rooms"
                value={form.rooms}
                onChange={(e) => setForm((p) => ({ ...p, rooms: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Add Hotel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}