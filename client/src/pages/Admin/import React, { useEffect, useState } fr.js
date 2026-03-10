import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  // Fetch users from API
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
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit new user creation
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

      toast.success("User created successfully!");

      // Clear form
      setFormData({ name: "", email: "", password: "", role: "customer" });
      setModalOpen(false);

      // Refresh user list
      fetchUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <ToastContainer />

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
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded shadow-sm">
          <thead>
            <tr className="bg-yellow-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
  {users.map((u) => {
    if (!u) return null; // skip invalid user

    const nameRaw = u.name || "";
    const parts = nameRaw.trim().split(" ");

    const role =
      u.role ||
      (parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown");

    // If role was parsed from name, remove last part from name
    const name =
      u.role || parts.length <= 1
        ? nameRaw
        : parts.slice(0, -1).join(" ");

    return (
      <tr key={u._id || Math.random()}>
        <td>{name}</td>
        <td>{u.email || "N/A"}</td>
        <td>{role}</td>
      </tr>
    );
  })}
</tbody>

        </table>
      )}

      {/* Modal */}
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
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
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
