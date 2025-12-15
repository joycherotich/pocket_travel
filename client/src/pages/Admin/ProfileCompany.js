import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";

export default function ProfileCompany() {
  // Load saved company or default with fallback for website/address
  const savedCompanyRaw = sessionStorage.getItem("companyProfile");
  let savedCompany;
  try {
    savedCompany = savedCompanyRaw ? JSON.parse(savedCompanyRaw) : null;
  } catch {
    savedCompany = null;
  }

  const defaultCompany = {
    name: "Pocket of Paradise Travel",
    description: "Affordable Packages\nHotel Booking\nFlight Transfer",
    phone: "0722 787 851",
    email: "pocketofparadisetravel@gmail.com",
    website: "https://pocket-paradise-website.vercel.app/",
    address: "The Nord Mall | Ruiru Ndani |",
  };

  const [company, setCompany] = useState(() => {
    if (!savedCompany) return defaultCompany;
    return {
      ...defaultCompany,
      ...savedCompany,
      website: savedCompany.website?.trim()
        ? savedCompany.website
        : defaultCompany.website,
      address: savedCompany.address?.trim()
        ? savedCompany.address
        : defaultCompany.address,
    };
  });

  const [isEditing, setIsEditing] = useState(false);

  // Save company info to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("companyProfile", JSON.stringify(company));
  }, [company]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  // Load user info from sessionStorage
  const savedUser = sessionStorage.getItem("user");
  const defaultUser = { name: "", email: "" };
  const userObj = savedUser ? JSON.parse(savedUser) : defaultUser;

  // Load profile picture from sessionStorage (base64 string)
  const savedPic = sessionStorage.getItem("profilePic");
  const [profilePic, setProfilePic] = useState(savedPic || null);

  // Handle image file upload and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      sessionStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save button handler
  const handleSave = () => {
    setIsEditing(false);
    alert("Company profile saved locally!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 mt-12 font-[Poppins] text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-yellow-600 drop-shadow-lg">
          {company.name}
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`mt-6 md:mt-0 inline-flex items-center gap-3 px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
            isEditing
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          aria-label={isEditing ? "Save changes" : "Edit profile"}
        >
          {isEditing ? <FaSave size={18} /> : <FaEdit size={18} />}
          <span className="text-lg">{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Company Details */}
      <div className="space-y-8">
        {/* Description */}
        <div>
          <label className="block mb-2 text-lg font-semibold font-[Poppins] text-gray-700">
            Description
          </label>
          {isEditing ? (
            <textarea
              name="description"
              value={company.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-yellow-300 font-[Poppins] p-4 text-lg resize-y placeholder-yellow-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-inner transition"
              placeholder="Describe your company..."
            />
          ) : (
            <pre className="whitespace-pre-wrap rounded-xl font-[Poppins] bg-yellow-50 p-5 text-lg leading-relaxed shadow-inner">
              {company.description}
            </pre>
          )}
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phone */}
          <div>
            <label className="block mb-2 text-md font-semibold text-gray-700">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={company.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-yellow-300 p-3 text-md focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition"
                placeholder="Enter phone number"
              />
            ) : (
              <p className="flex items-center gap-3 text-yellow-600 font-semibold text-lg select-text">
                <FaPhoneAlt size={20} /> {company.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-md font-semibold text-gray-700">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={company.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-yellow-300 p-3 text-md focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition"
                placeholder="Enter company email"
              />
            ) : (
              <p className="flex items-center gap-3 text-yellow-600 font-semibold text-lg select-text">
                <FaEnvelope size={20} /> {company.email}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block mb-2 text-md font-semibold text-gray-700">Website</label>
            {isEditing ? (
              <input
                type="text"
                name="website"
                value={company.website}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-lg border border-yellow-300 p-3 text-md focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition"
              />
            ) : company.website?.trim() ? (
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-yellow-600 font-semibold text-lg select-text hover:underline"
              >
                <FaGlobe size={20} /> {company.website}
              </a>
            ) : (
              <p className="text-gray-400 italic">No website provided</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 text-md font-semibold text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={company.address}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-lg border border-yellow-300 p-3 text-md focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition"
              />
            ) : company.address?.trim() ? (
              <p className="flex items-center gap-3 text-yellow-600 font-semibold text-lg select-text">
                <FaMapMarkerAlt size={20} /> {company.address}
              </p>
            ) : (
              <p className="text-gray-400 italic">No address provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Picture Upload */}
      {/* <div className="mt-12 flex flex-col items-center">
        <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-yellow-400 shadow-md mb-4">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">
              No Profile Pic
            </div>
          )}
        </div>
        <label
          htmlFor="profilePicInput"
          className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
        >
          Upload Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          id="profilePicInput"
          onChange={handleImageChange}
          className="hidden"
        />
      </div> */}

      {/* User Info Section */}
      <div className="mt-16 border-t border-yellow-300 pt-10">
        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-600 drop-shadow-md">
          <FaUserCircle size={30} /> User Info
        </h3>
        <div className="space-y-4 text-lg text-gray-700 max-w-md">
          <p>
            <span className="font-semibold">Name:</span> {userObj.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {userObj.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
