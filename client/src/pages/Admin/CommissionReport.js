import React, { useEffect, useState, useMemo } from "react";

const API = "http://localhost:5000";

// ── Booking status matches your enum exactly ──────────────────────────────────
const BOOKING_STATUS = {
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Confirmed: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  Pending:   { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-500"  },
  Cancelled: { bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-400"     },
};

// ── Lightweight toast ─────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return { toasts, success: m => add(m,"success"), error: m => add(m,"error"), info: m => add(m,"info") };
}
function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} style={{ animation:"slideIn .25s ease" }}
          className={`px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${
            t.type==="success" ? "bg-emerald-500/90" : t.type==="error" ? "bg-red-500/90" : "bg-gray-700/90"
          }`}>{t.msg}</div>
      ))}
    </div>
  );
}

// ── Mock data (fallback) ──────────────────────────────────────────────────────
const MOCK_STAFF = [
  { _id:"s1", name:"Test Staff",  email:"joycherotich67@gmail.com", role:"staff",   commissionRate:0.10, clientCount:3, activeClients:2, completedBookings:4, pendingBookings:1, confirmedBookings:1, totalBookings:6,  totalRevenue:850000,  totalCommission:85000  },
  { _id:"s2", name:"REST001",     email:"luqmanrubi8@gmail.com",    role:"staff",   commissionRate:0.10, clientCount:2, activeClients:2, completedBookings:2, pendingBookings:1, confirmedBookings:0, totalBookings:3,  totalRevenue:420000,  totalCommission:42000  },
  { _id:"s3", name:"Joy Admin",   email:"letimjoy7@gmail.com",      role:"admin",   commissionRate:0.08, clientCount:5, activeClients:4, completedBookings:7, pendingBookings:2, confirmedBookings:1, totalBookings:10, totalRevenue:1200000, totalCommission:96000  },
];

const MOCK_DETAIL = {
  s1: {
    staff: { _id:"s1", name:"Test Staff", email:"joycherotich67@gmail.com", role:"staff", commissionRate:0.10 },
    totalRevenue: 850000, totalCommission: 85000,
    clients: [
      { _id:"c1", name:"Luqman Rubi",   email:"rubiluqman7@gmail.com",  phone:"+254 712 345678", status:"active",   destination:"Dubai",   createdAt:"2026-01-15T10:00:00Z", completedCount:2, pendingCount:1, confirmedCount:0, totalRevenue:405000, commission:40500,
        bookings:[
          { _id:"b1", destination:"Dubai City Break",    status:"Completed", totalPrice:230000, checkIn:"2026-02-10", checkOut:"2026-02-15", guests:2, createdAt:"2026-01-18T00:00:00Z" },
          { _id:"b2", destination:"Nairobi Safari",      status:"Completed", totalPrice:175000, checkIn:"2026-03-01", checkOut:"2026-03-05", guests:1, createdAt:"2026-02-05T00:00:00Z" },
          { _id:"b3", destination:"Mombasa Beach",       status:"Pending",   totalPrice:120000, checkIn:"2026-04-10", checkOut:"2026-04-14", guests:2, createdAt:"2026-03-01T00:00:00Z" },
        ]},
      { _id:"c2", name:"mash mash",     email:"luqmanrubi46@gmail.com", phone:"+254 723 456789", status:"active",   destination:"London",  createdAt:"2026-01-22T09:00:00Z", completedCount:1, pendingCount:0, confirmedCount:1, totalRevenue:310000, commission:31000,
        bookings:[
          { _id:"b4", destination:"London Business Trip",status:"Completed", totalPrice:310000, checkIn:"2026-02-20", checkOut:"2026-02-25", guests:1, createdAt:"2026-01-25T00:00:00Z" },
          { _id:"b5", destination:"Paris Getaway",       status:"Confirmed", totalPrice:185000, checkIn:"2026-05-01", checkOut:"2026-05-06", guests:2, createdAt:"2026-03-05T00:00:00Z" },
        ]},
      { _id:"c3", name:"rubiii7",       email:"rubiluqman8@gmail.com",  phone:"+254 734 567890", status:"inactive", destination:"Tokyo",   createdAt:"2026-02-01T08:00:00Z", completedCount:0, pendingCount:1, confirmedCount:0, totalRevenue:0,      commission:0,
        bookings:[
          { _id:"b6", destination:"Tokyo Adventure",     status:"Pending",   totalPrice:280000, checkIn:"2026-06-01", checkOut:"2026-06-08", guests:2, createdAt:"2026-03-02T00:00:00Z" },
        ]},
    ],
  },
  s2: {
    staff: { _id:"s2", name:"REST001", email:"luqmanrubi8@gmail.com", role:"staff", commissionRate:0.10 },
    totalRevenue: 420000, totalCommission: 42000,
    clients: [
      { _id:"c4", name:"Jane Wanjiku",  email:"jane@example.com",      phone:"+254 745 678901", status:"active",   destination:"Cape Town", createdAt:"2026-02-10T11:00:00Z", completedCount:1, pendingCount:0, confirmedCount:0, totalRevenue:420000, commission:42000,
        bookings:[
          { _id:"b7", destination:"Cape Town Explorer",  status:"Completed", totalPrice:420000, checkIn:"2026-03-01", checkOut:"2026-03-07", guests:1, createdAt:"2026-02-15T00:00:00Z" },
        ]},
      { _id:"c5", name:"Peter Kamau",   email:"peter@example.com",     phone:"+254 756 789012", status:"active",   destination:"Bangkok",  createdAt:"2026-03-01T14:00:00Z", completedCount:0, pendingCount:1, confirmedCount:0, totalRevenue:0,      commission:0,
        bookings:[
          { _id:"b8", destination:"Bangkok Holiday",     status:"Pending",   totalPrice:95000,  checkIn:"2026-05-10", checkOut:"2026-05-15", guests:3, createdAt:"2026-03-05T00:00:00Z" },
        ]},
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt     = (n) => `KES ${Number(n||0).toLocaleString("en-KE")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const initials = (name) => name?.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase() || "?";

const AVATAR_BG = ["bg-yellow-400","bg-teal-500","bg-indigo-400","bg-pink-400","bg-orange-400","bg-sky-500"];
const avatarBg  = (name) => AVATAR_BG[(name?.charCodeAt(0)||0) % AVATAR_BG.length];

const ROLE_STYLE = {
  admin:   "bg-red-100    text-red-600",
  finance: "bg-purple-100 text-purple-600",
  staff:   "bg-blue-100   text-blue-600",
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Commissions() {
  const toast = useToast();

  const [staffList, setStaffList]   = useState([]);
  const [detail, setDetail]         = useState(null);     // { staff, clients, totalRevenue, totalCommission }
  const [loadingList, setLoadingList]   = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rateInput, setRateInput]   = useState("10");
  const [globalRate, setGlobalRate] = useState(0.10);
  const [editingRate, setEditingRate] = useState(false);
  const [tempRate, setTempRate]     = useState("");
  const [savingRate, setSavingRate] = useState(false);
  const [payModal, setPayModal]     = useState(false);

  // ── Load staff list ──
  useEffect(() => {
    setLoadingList(true);
    fetch(`${API}/api/commissions/staff`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setStaffList(Array.isArray(data) && data.length ? data : MOCK_STAFF))
      .catch(() => setStaffList(MOCK_STAFF))
      .finally(() => setLoadingList(false));
  }, []);

  // ── Load staff detail ──
  const loadDetail = (staffId) => {
    setDetail(null);
    setSelectedClient(null);
    setStatusFilter("all");
    setSearch("");
    setEditingRate(false);
    setLoadingDetail(true);
    fetch(`${API}/api/commissions/staff/${staffId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setDetail(data); if (data.staff?.commissionRate) setTempRate((data.staff.commissionRate*100).toFixed(1)); })
      .catch(() => { const mock = MOCK_DETAIL[staffId]; setDetail(mock||null); if (mock?.staff?.commissionRate) setTempRate((mock.staff.commissionRate*100).toFixed(1)); })
      .finally(() => setLoadingDetail(false));
  };

  // ── Save rate ──
  const saveRate = async () => {
    const rate = parseFloat(tempRate) / 100;
    if (isNaN(rate) || rate < 0 || rate > 1) return toast.error("Enter 0–100");
    setSavingRate(true);
    try {
      await fetch(`${API}/api/commissions/staff/${detail.staff._id}/rate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate }),
      });
      setDetail(p => ({ ...p, staff: { ...p.staff, commissionRate: rate }, totalCommission: p.totalRevenue * rate,
        clients: p.clients.map(c => ({ ...c, commission: c.totalRevenue * rate })) }));
      setStaffList(p => p.map(s => s._id === detail.staff._id ? { ...s, commissionRate: rate, totalCommission: s.totalRevenue * rate } : s));
      toast.success(`Rate updated to ${(rate*100).toFixed(1)}%`);
    } catch { toast.error("Failed to save rate"); }
    setSavingRate(false);
    setEditingRate(false);
  };

  // ── Derived ──
  const rate            = detail?.staff?.commissionRate ?? globalRate;
  const clients         = detail?.clients || [];
  const selectedBookings = selectedClient
    ? (clients.find(c => c._id === selectedClient._id)?.bookings || [])
    : [];

  const filteredClients = useMemo(() => clients.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [clients, search, statusFilter]);

  const totalSummary = useMemo(() => ({
    totalStaff:      staffList.length,
    totalRevenue:    staffList.reduce((a,s) => a + s.totalRevenue, 0),
    totalCommission: staffList.reduce((a,s) => a + s.totalCommission, 0),
    totalClients:    staffList.reduce((a,s) => a + s.clientCount, 0),
  }), [staffList]);

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif" }} className="space-y-6 pb-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation:fadeUp .28s ease both; }
      `}</style>
      <Toasts toasts={toast.toasts} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Commissions</h1>
          <p className="text-gray-500 text-sm mt-0.5">Staff · assigned clients · completed bookings · earned commissions</p>
        </div>
        {/* Global rate control */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Global Rate</span>
          <input type="number" min="1" max="100" value={rateInput}
            onChange={e => setRateInput(e.target.value)}
            onBlur={() => {
              const v = parseFloat(rateInput);
              if (!isNaN(v) && v > 0 && v <= 100) { setGlobalRate(v/100); toast.success(`Global rate set to ${v}%`); }
            }}
            className="w-14 text-center border-0 text-yellow-700 font-bold text-sm focus:outline-none" />
          <span className="text-yellow-700 font-bold text-sm">%</span>
        </div>
      </div>

      {/* ── Top summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Staff Members",  value: totalSummary.totalStaff,            icon:"👥", color:"bg-indigo-50  text-indigo-700"  },
          { label:"Total Clients",  value: totalSummary.totalClients,           icon:"🧑‍💼", color:"bg-teal-50    text-teal-700"    },
          { label:"Total Revenue",  value: fmt(totalSummary.totalRevenue),      icon:"💰", color:"bg-emerald-50 text-emerald-700" },
          { label:"Commissions Due",value: fmt(totalSummary.totalCommission),   icon:"🏆", color:"bg-yellow-50  text-yellow-700"  },
        ].map((c,i) => (
          <div key={i} style={{ animationDelay:`${i*55}ms` }}
            className={`fu rounded-2xl p-4 shadow-sm ${c.color}`}>
            <p className="text-2xl mb-1">{c.icon}</p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">{c.label}</p>
            <p className="text-xl font-bold mt-0.5">{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── Three-panel layout ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ══ PANEL 1 — Staff list ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-700 text-sm mb-2">Staff Members ({staffList.length})</h2>
            <input type="search" placeholder="Search staff…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          {loadingList ? (
            <div className="p-6 text-center text-gray-400 animate-pulse text-sm">Loading staff…</div>
          ) : (
            <div className="divide-y divide-gray-50 overflow-y-auto max-h-[560px]">
              {staffList
                .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))
                .map((s, i) => {
                  const isActive = detail?.staff?._id === s._id;
                  const rc = ROLE_STYLE[s.role?.toLowerCase()] || ROLE_STYLE.staff;
                  return (
                    <button key={s._id} onClick={() => loadDetail(s._id)}
                      style={{ animationDelay:`${i*40}ms` }}
                      className={`fu w-full text-left px-4 py-3 transition hover:bg-yellow-50 ${isActive ? "bg-yellow-50 border-l-4 border-yellow-500" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarBg(s.name)}`}>
                          {initials(s.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold capitalize ${rc}`}>{s.role}</span>
                          </div>
                          <p className="text-xs text-gray-400 truncate">{s.email}</p>
                          {/* Mini stats */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-500">{s.clientCount} client{s.clientCount!==1?"s":""}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-emerald-600 font-semibold">{s.completedBookings} done</span>
                            {s.pendingBookings > 0 && <><span className="text-gray-300">·</span><span className="text-xs text-yellow-600 font-semibold">{s.pendingBookings} pending</span></>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400">{(s.commissionRate*100).toFixed(0)}%</p>
                          <p className="text-xs font-bold text-yellow-600">{fmt(s.totalCommission)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* ══ PANEL 2 — Clients of selected staff ═══════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
          {!detail && !loadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <span className="text-5xl mb-3">👈</span>
              <p className="font-semibold text-gray-600">Select a staff member</p>
              <p className="text-xs mt-1">to see their assigned clients</p>
            </div>
          ) : loadingDetail ? (
            <div className="p-6 text-center text-gray-400 animate-pulse text-sm">Loading clients…</div>
          ) : (
            <>
              {/* Staff header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarBg(detail.staff.name)}`}>
                    {initials(detail.staff.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-800 text-sm">{detail.staff.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold capitalize ${ROLE_STYLE[detail.staff.role] || ROLE_STYLE.staff}`}>{detail.staff.role}</span>
                    </div>
                    <p className="text-xs text-gray-400">{detail.staff.email}</p>
                  </div>
                  {/* Rate editor */}
                  <div className="text-right shrink-0">
                    {editingRate ? (
                      <div className="flex items-center gap-1">
                        <input type="number" min="0" max="100" step="0.5" value={tempRate}
                          onChange={e => setTempRate(e.target.value)}
                          className="w-14 text-center border-2 border-yellow-400 rounded-lg text-xs font-bold px-1 py-1 focus:outline-none" />
                        <span className="text-xs">%</span>
                        <button onClick={saveRate} disabled={savingRate}
                          className="text-xs bg-teal-500 text-white px-2 py-1 rounded-lg font-semibold">{savingRate?"…":"✓"}</button>
                        <button onClick={() => setEditingRate(false)} className="text-xs text-gray-400">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingRate(true); setTempRate((rate*100).toFixed(1)); }}
                        className="text-right group">
                        <p className="text-lg font-black text-yellow-600">{(rate*100).toFixed(1)}%</p>
                        <p className="text-xs text-gray-400 group-hover:text-yellow-600 transition">rate ✏️</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Revenue / commission pills */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-semibold text-emerald-600">Revenue</p>
                    <p className="text-sm font-bold text-emerald-700">{fmt(detail.totalRevenue)}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-semibold text-yellow-600">Commission</p>
                    <p className="text-sm font-bold text-yellow-700">{fmt(detail.totalCommission)}</p>
                  </div>
                </div>

                {/* Client status filter */}
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {["all","active","inactive"].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize transition ${
                        statusFilter===f ? "bg-yellow-500 border-yellow-500 text-white" : "bg-white border-gray-200 text-gray-500 hover:border-yellow-300"
                      }`}>{f} {f==="all" ? `(${clients.length})` : f==="active" ? `(${clients.filter(c=>c.status==="active").length})` : `(${clients.filter(c=>c.status==="inactive").length})`}</button>
                  ))}
                </div>
              </div>

              {/* Clients list */}
              {filteredClients.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
                  <div><p className="text-3xl mb-2">📭</p><p className="text-sm">No clients found</p></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
                  {filteredClients.map((c, i) => {
                    const isSelected = selectedClient?._id === c._id;
                    return (
                      <button key={c._id} onClick={() => setSelectedClient(isSelected ? null : c)}
                        style={{ animationDelay:`${i*35}ms` }}
                        className={`fu w-full text-left px-4 py-3 transition hover:bg-yellow-50 ${isSelected ? "bg-yellow-50 border-l-4 border-yellow-500" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarBg(c.name)}`}>
                                {c.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                                <p className="text-xs text-gray-400 truncate">{c.email}</p>
                              </div>
                            </div>
                            {c.phone && <p className="text-xs text-gray-400 mt-1 ml-9">📞 {c.phone}</p>}
                            {c.destination && <p className="text-xs text-gray-400 ml-9">✈️ {c.destination}</p>}
                            <p className="text-xs text-gray-300 mt-0.5 ml-9">Since {fmtDate(c.createdAt)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {/* Client active/inactive status */}
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${c.status==="active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                              {c.status}
                            </span>
                            {/* Booking breakdown */}
                            <div className="mt-1 space-y-0.5">
                              <p className="text-xs text-gray-400">{c.bookings?.length||0} booking{c.bookings?.length!==1?"s":""}</p>
                              {c.completedCount > 0 && <p className="text-xs text-emerald-600 font-semibold">{c.completedCount} completed</p>}
                              {c.pendingCount > 0 && <p className="text-xs text-yellow-600">{c.pendingCount} pending</p>}
                              {c.totalRevenue > 0 && <p className="text-xs font-bold text-blue-600">{fmt(c.totalRevenue)}</p>}
                              {c.commission > 0 && <p className="text-xs font-bold text-yellow-600">{fmt(c.commission)}</p>}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pay button */}
              {detail.totalCommission > 0 && (
                <div className="p-3 border-t border-gray-100 mt-auto">
                  <button onClick={() => setPayModal(true)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                    💳 Pay Commission — {fmt(detail.totalCommission)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ══ PANEL 3 — Bookings of selected client ═════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
          {!selectedClient ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <span className="text-5xl mb-3">📋</span>
              <p className="font-semibold text-gray-600">Select a client</p>
              <p className="text-xs mt-1">to view their bookings & commission breakdown</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarBg(selectedClient.name)}`}>
                    {selectedClient.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{selectedClient.name}</p>
                    <p className="text-xs text-gray-400">{selectedClient.email}</p>
                  </div>
                </div>
                {/* Booking status summary */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label:"Total",     val: selectedBookings.length,                                      bg:"bg-gray-50    text-gray-700"   },
                    { label:"Completed", val: selectedBookings.filter(b=>b.status==="Completed").length,    bg:"bg-emerald-50 text-emerald-700" },
                    { label:"Confirmed", val: selectedBookings.filter(b=>b.status==="Confirmed").length,    bg:"bg-blue-50    text-blue-700"    },
                    { label:"Pending",   val: selectedBookings.filter(b=>b.status==="Pending").length,      bg:"bg-yellow-50  text-yellow-700"  },
                  ].map(s => (
                    <div key={s.label} className={`rounded-xl p-2 text-center ${s.bg}`}>
                      <p className="text-base font-bold">{s.val}</p>
                      <p className="text-xs font-semibold opacity-70">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedBookings.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
                  <div><p className="text-3xl mb-2">📭</p><p className="text-sm">No bookings yet</p></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
                  {selectedBookings.map((b, i) => {
                    const st = BOOKING_STATUS[b.status] || { bg:"bg-gray-100", text:"text-gray-600", dot:"bg-gray-400" };
                    const isCompleted = b.status === "Completed";
                    return (
                      <div key={b._id} style={{ animationDelay:`${i*35}ms` }}
                        className="fu px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {b.destination || b.hotelName || "Booking"}
                            </p>
                            {/* Dates */}
                            {b.checkIn && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                📅 {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                              </p>
                            )}
                            {b.guests && <p className="text-xs text-gray-400">👤 {b.guests} guest{b.guests!==1?"s":""}</p>}
                            <p className="text-xs text-gray-300 mt-0.5">Added {fmtDate(b.createdAt)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {/* Status badge */}
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>
                              {b.status}
                            </span>
                            {/* Amount */}
                            <p className={`mt-1 font-bold text-sm ${isCompleted ? "text-blue-600" : "text-gray-400"}`}>
                              {fmt(b.totalPrice)}
                            </p>
                            {/* Commission — only on completed */}
                            {isCompleted && (
                              <p className="text-xs font-bold text-yellow-600">
                                {fmt(Math.round(b.totalPrice * rate))} comm.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Client commission footer */}
              {(() => {
                const cc = clients.find(c => c._id === selectedClient._id);
                return cc?.commission > 0 ? (
                  <div className="p-3 border-t border-gray-100 mt-auto bg-yellow-50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-semibold">Commission from {selectedClient.name}</span>
                      <span className="text-yellow-700 font-bold text-base">{fmt(cc.commission)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cc.completedCount} completed booking{cc.completedCount!==1?"s":""} · {fmt(cc.totalRevenue)} revenue
                    </p>
                  </div>
                ) : null;
              })()}
            </>
          )}
        </div>
      </div>

      {/* ── Pay Commission Modal ── */}
      {payModal && detail && (
        <div onClick={() => setPayModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative fu">
            <button onClick={() => setPayModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>

            <div className="text-center mb-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto ${avatarBg(detail.staff.name)}`}>
                {initials(detail.staff.name)}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-2">{detail.staff.name}</h2>
              <p className="text-sm text-gray-400">{detail.staff.email}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Clients</span>
                <span className="font-semibold">{clients.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completed Revenue</span>
                <span className="font-semibold">{fmt(detail.totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Commission Rate</span>
                <span className="font-semibold">{(rate*100).toFixed(1)}%</span>
              </div>
              <div className="border-t border-yellow-200 my-1" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-700">Commission Due</span>
                <span className="font-black text-yellow-700 text-xl">{fmt(detail.totalCommission)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button onClick={() => { toast.success(`M-Pesa payment initiated for ${detail.staff.name} 📲`); setPayModal(false); }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                📲 Pay via M-Pesa
              </button>
              <button onClick={() => { toast.success(`Bank transfer scheduled for ${detail.staff.name} 🏦`); setPayModal(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                🏦 Bank Transfer
              </button>
              <button onClick={() => { toast.info("Marked as paid ✅"); setPayModal(false); }}
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition text-sm">
                ✅ Mark as Paid Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}