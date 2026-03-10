import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ClientsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting]   = useState(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", destination: "", notes: "" });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // ← assignedTo: send logged-in user's id so commissions work
        body: JSON.stringify({ ...form, assignedTo: user?._id }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed"); return; }
      toast.success("Client added ✅");
      setModalOpen(false);
      setForm({ name: "", email: "", phone: "", destination: "", notes: "" });
      fetchClients();
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    setDeleting(id);
    try {
      await fetch(`http://localhost:5000/api/clients/${id}`, { method: "DELETE" });
      toast.success("Client deleted");
      fetchClients();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="font-[Poppins] space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isAdmin ? "Manage all clients" : "Manage your clients"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input type="search" placeholder="Search client..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <button onClick={() => setModalOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow transition">
            + Add Client
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading clients...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 italic">No clients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50 text-gray-600 text-left">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Assigned To</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c._id || i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.email || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{c.phone || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {c.destination || "—"}
                      </span>
                    </td>
                    {/* ← shows which staff owns this client */}
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {c.assignedTo?.name || (c.assignedTo ? "Staff" : <span className="text-red-400">Unassigned</span>)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => toast("Edit coming soon")}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-semibold hover:underline mr-3">
                        Edit
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline disabled:opacity-50">
                          {deleting === c._id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Client Modal ── */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>

            <h2 className="text-xl font-bold text-yellow-700 mb-1">Add New Client</h2>
            {/* Show who will be assigned */}
            <p className="text-xs text-gray-400 mb-4">
              Will be assigned to: <strong className="text-gray-600">{user?.name || "you"}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name:"name",        placeholder:"Full Name *",  type:"text"  },
                { name:"email",       placeholder:"Email",        type:"email" },
                { name:"phone",       placeholder:"Phone Number", type:"text"  },
                { name:"destination", placeholder:"Destination",  type:"text"  },
              ].map(f => (
                <input key={f.name} type={f.type} placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  required={f.name === "name"}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              ))}
              <textarea placeholder="Notes (optional)" value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
              <button type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-xl font-semibold text-sm transition mt-2">
                Add Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}