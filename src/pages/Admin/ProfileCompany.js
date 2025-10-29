import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export default function ProfileCompany({ companyId }) {
  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    adminEmail: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch company details
  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/companies/${companyId}`);
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }
    fetchCompany();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });

      if (!response.ok) throw new Error("Failed to update company");

      setIsEditing(false);
      alert("Company profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating company profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{company.name || "Company Name"}</h2>
          <p className="text-gray-500 mt-1">Manage your company profile & admin info</p>
        </div>
        <div className="mt-4 md:mt-0">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <FaSave /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
              isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
            }`}
          />
        </div>

        {/* Admin Email */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Admin Email</label>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="adminEmail"
              value={company.adminEmail}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
                isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Company Email */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Company Email</label>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
                isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Phone</label>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400" />
            <input
              type="text"
              name="phone"
              value={company.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
                isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Address</label>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
                isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Website */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Website</label>
          <div className="flex items-center gap-2">
            <FaGlobe className="text-gray-400" />
            <input
              type="text"
              name="website"
              value={company.website}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
                isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Optional Description Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">About the Company</h3>
        <textarea
          name="description"
          value={company.description || ""}
          onChange={handleChange}
          disabled={!isEditing}
          rows={4}
          placeholder="Add a brief description about your company..."
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring ${
            isEditing ? "border-blue-400" : "border-gray-300 bg-gray-100"
          }`}
        />
      </div>
    </div>
  );
}
