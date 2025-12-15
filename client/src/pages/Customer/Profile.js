import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaEdit,
  FaSave,
  FaCamera,
} from "react-icons/fa";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Amani Wanderlust",
    email: "amani@pocketofparadise.com",
    phone: "+254 712 345 678",
    country: "Kenya",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    // TODO: Save profile updates to backend
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="font-[Poppins] px-4 md:px-10 py-8 bg-gradient-to-br from-teal-50 to-yellow-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* <h2 className="text-3xl font-bold text-teal-700">
            My Pocket of Paradise
          </h2> */}
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition ${
              editing
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            {editing ? <FaSave /> : <FaEdit />}
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          {/* Avatar */}
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-300 shadow-md"
              />
            ) : (
              <FaUserCircle className="text-gray-300 text-[128px]" />
            )}

            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-teal-700 transition"
            >
              <FaCamera size={16} />
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Info Form */}
          <div className="flex-1 w-full space-y-5">
            {[
              { label: "Full Name", name: "name", icon: <FaUserCircle /> },
              { label: "Email Address", name: "email", icon: <FaEnvelope /> },
              { label: "Phone Number", name: "phone", icon: <FaPhone /> },
              { label: "Country", name: "country", icon: <FaGlobe /> },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2.5 bg-white shadow-sm">
                  <span className="text-teal-500 mr-3">{field.icon}</span>
                  <input
                    type="text"
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full focus:outline-none bg-transparent ${
                      editing ? "text-gray-800" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          🌴 Pocket of Paradise — Find your escape, live your dream.
        </div>
      </motion.div>
    </div>
  );
}
