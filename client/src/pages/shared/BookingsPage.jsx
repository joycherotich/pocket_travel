import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  Confirmed: "bg-green-100 text-green-700",
  Pending:   "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
  Completed: "bg-blue-100 text-blue-700",
};

const fmt = (n) => n ? `KES ${Number(n).toLocaleString("en-KE")}` : "—";

export default function BookingsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [bookings, setBookings]   = useState([]);
  const [clients, setClients]     = useState([]);   // ← for dropdown
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    client:      "",          // ← ObjectId of selected client
    clientName:  "",          // ← kept for display / legacy
    destination: "",
    date:        "",
    checkIn:     "",
    checkOut:    "",
    guests:      1,
    totalPrice:  "",          // ← KES amount for commissions
    status:      "Pending",
    notes:       "",
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients for dropdown — staff sees only their own
  const fetchClients = async () => {
    try {
      const url = isAdmin
        ? "http://localhost:5000/api/clients"
        : `http://localhost:5000/api/clients?assignedTo=${user?._id}`;
      const res  = await fetch(url);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchBookings(); fetchClients(); }, []);

  // When client is selected from dropdown, auto-fill clientName + destination
  const handleClientSelect = (clientId) => {
    const c = clients.find(c => c._id === clientId);
    setForm(p => ({
      ...p,
      client:      clientId,
      clientName:  c?.name || "",
      destination: c?.destination || p.destination,
    }));
  };

  const filtered = bookings.filter(b => {
    const name = b.clientName || b.client?.name || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.totalPrice || Number(form.totalPrice) <= 0) {
      toast.error("Please enter a booking amount (KES)");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/bookings", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          totalPrice: Number(form.totalPrice),
          guests:     Number(form.guests),
          createdBy:  user?._id,   // ← staff who created
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed"); return; }
      toast.success("Booking created ✅");
      setModalOpen(false);
      setForm({ client:"", clientName:"", destination:"", date:"", checkIn:"", checkOut:"", guests:1, totalPrice:"", status:"Pending", notes:"" });
      fetchBookings();
    } catch {
      toast.error("Server error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      toast.success("Status updated");
      fetchBookings();
    } catch {
      toast.error("Update failed");
    }
  };

  // Revenue from completed bookings
  const completedRevenue = bookings
    .filter(b => b.status === "Completed")
    .reduce((a, b) => a + (b.totalPrice || 0), 0);

  return (
    <div className="font-[Poppins] space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isAdmin ? "All bookings across the agency" : "Your assigned bookings"}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input type="search" placeholder="Search client..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
            {["All","Pending","Confirmed","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setModalOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow transition">
            + New Booking
          </button>
        </div>
      </div>

      {/* Revenue pill */}
      {completedRevenue > 0 && (
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm">
          <span className="text-emerald-600 font-semibold">Completed Revenue:</span>
          <span className="font-bold text-emerald-700">{fmt(completedRevenue)}</span>
        </div>
      )}

      {/* Status pills */}
      <div className="flex gap-3 flex-wrap">
        {["All","Pending","Confirmed","Completed","Cancelled"].map(s => {
          const count = s === "All" ? bookings.length : bookings.filter(b => b.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={"px-4 py-1.5 rounded-full text-xs font-semibold border transition " +
                (filter === s ? "bg-yellow-600 text-white border-yellow-600" : "bg-white text-gray-600 border-gray-200 hover:border-yellow-400")}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 italic">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50 text-gray-600 text-left">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount (KES)</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id || i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {b.clientName || b.client?.name || b.client || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{b.destination || "—"}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-KE") : b.date ? new Date(b.date).toLocaleDateString("en-KE") : "—"}
                    </td>
                    <td className="px-5 py-3 font-semibold text-blue-600">{fmt(b.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <span className={"px-2.5 py-1 rounded-full text-xs font-semibold " + (STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600")}>
                        {b.status || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400">
                        {["Pending","Confirmed","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-xl font-bold text-yellow-700 mb-4">New Booking</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* ← Client dropdown — links booking to client for commissions */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Client *</label>
                <select value={form.client} onChange={e => handleClientSelect(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="">Select a client…</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.destination || "no destination"}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Destination</label>
                <input type="text" placeholder="e.g. Mombasa, Dubai" value={form.destination}
                  onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Check In</label>
                  <input type="date" value={form.checkIn}
                    onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Check Out</label>
                  <input type="date" value={form.checkOut}
                    onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Guests</label>
                  <input type="number" min="1" value={form.guests}
                    onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  {/* ← THIS IS KEY for commissions */}
                  <label className="text-xs font-bold text-gray-500 block mb-1">Amount (KES) *</label>
                  <input type="number" min="0" placeholder="e.g. 85000" required value={form.totalPrice}
                    onChange={e => setForm(p => ({ ...p, totalPrice: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  {["Pending","Confirmed","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <textarea placeholder="Notes (optional)" value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />

              <button type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">
                Create Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}