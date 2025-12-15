import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/travel.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout: contextLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const logout = () => {
    contextLogout();
    window.location.href = "/login";
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl shadow-md z-50 font-[Poppins]">
      <div className="flex justify-between items-center px-6 md:px-16 py-3 transition-all duration-300">

        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src={logo}
            alt="Travel Logo"
            className="h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <span className="hidden sm:block text-2xl font-extrabold tracking-tight text-gray-800">
            Pocket Of Paradise <span className="text-yellow-600">Travel ✈️</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-[16px] font-medium text-gray-700">
          <a href="/" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Home
          </a>
          <a href="#destinations" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Destinations
          </a>
          <a href="#" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Safaris
          </a>
          <a href="#" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Holidays
          </a>
        </nav>

        {/* Right buttons */}
        <div className="hidden md:flex items-center space-x-4">

          {/* IF NOT LOGGED IN */}
          {!user && (
            <>
              <a
                href="/login"
                className="border border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
              >
                Login
              </a>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                Contact
              </button>
            </>
          )}

          {/* IF LOGGED IN */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none cursor-pointer"
              >
            <div className="text-right">
              <p className="text-gray-700 font-semibold">
                Welcome, <span className="text-yellow-700">{user.name} {user.role}</span>
                
              </p>
              {/* <p className="text-sm text-gray-500">
                <span className="capitalize font-medium">{user.role}</span>
              </p> */}
            </div>

                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
