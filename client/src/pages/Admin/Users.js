import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // ✅ roles from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);

      // Auto-select first role
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, role: data[0].name }));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create user");
      }

      setFormData({ name: "", email: "", password: "", role: roles[0]?.name || "" });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto font-[Poppins]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-700">Manage Users</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-5 rounded shadow-md transition"
        >
          Create User
        </button>
      </div>
      {/* User List */}
      <h2 className="text-xl font-semibold mb-2">Existing Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
  {users.map((u) => {
    if (!u || typeof u.name !== "string") return null;

    const parts = u.name.trim().split(" ");
    const role = u.role || (parts.length > 1 ? parts.pop().toLowerCase() : "unknown");
    const name = u.role ? u.name : parts.join(" ");

    return (
      <tr key={u._id || u.email || Math.random()}>
        <td className="border border-gray-300 px-4 py-2">{name}</td>
        <td className="border border-gray-300 px-4 py-2">{u.email || "N/A"}</td>
        <td className="border border-gray-300 px-4 py-2 capitalize">{role}</td>
      </tr>
    );
  })}
</tbody>


        </table>
      )}

{modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Create New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-600 font-semibold">{error}</p>}

              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role</label>
                <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 capitalize"
              >
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
