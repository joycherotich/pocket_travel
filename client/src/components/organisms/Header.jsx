import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/travel.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout: contextLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const dropdownRef = useRef();
  const location    = useLocation();

  const isAuthPage = ["/login", "/changepassword", "/change-password"].includes(location.pathname);

  const logout = () => {
    contextLogout();
    window.location.href = "/login";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial  = user && user.name ? user.name.charAt(0).toUpperCase() : "U";
  const userName     = user && user.name  ? user.name  : "";
  const userEmail    = user && user.email ? user.email : "";
  const userRole     = user && user.role  ? user.role  : "";
  const dashboardUrl = userRole === "admin" ? "/admin" : userRole === "staff" ? "/staff" : "/customer";

  const navLinks = [
    { label: "Home",         href: "/"             },
    { label: "Destinations", href: "#destinations" },
    { label: "Safaris",      href: "#safaris"      },
    { label: "Holidays",     href: "#holidays"     },
  ];

  return (
    <header
      className={
        "fixed top-0 left-0 w-full z-50 font-[Poppins] transition-all duration-300 " +
        (scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-xl py-3")
      }
    >
      <div className="flex justify-between items-center px-6 md:px-14">

        {/* ── Logo ── */}
        <a href="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Travel Logo"
            className="h-11 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <div className="hidden sm:block">
            <span className="text-xl font-extrabold tracking-tight text-gray-800">
              Pocket Of Paradise{" "}
            </span>
            <span className="text-xl font-extrabold text-yellow-600">Travel ✈️</span>
          </div>
        </a>

        {/* ── Nav ── */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 hover:-translate-y-[1px]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right Side ── */}
        <div className="hidden md:flex items-center gap-3">

          {/* Not logged in + not on auth page */}
          {!user && !isAuthPage && (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              >
                Login
              </a>
              <button className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                Contact Us
              </button>
            </div>
          )}

          {/* Logged in */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-full pl-1 pr-4 py-1 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {userInitial}
                </div>

                {/* Name + role */}
                <div className="text-left">
                  <p className="text-gray-800 font-semibold text-sm leading-none">{userName}</p>
                  <p className="text-yellow-600 text-xs capitalize font-medium mt-0.5">{userRole}</p>
                </div>

                {/* Chevron */}
                <svg
                  className={"w-4 h-4 text-gray-400 transition-transform duration-200 " + (dropdownOpen ? "rotate-180" : "")}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">

                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-gray-800 font-semibold text-sm">{userName}</p>
                    <p className="text-gray-400 text-xs">{userEmail}</p>
                  </div>

                  {/* Dashboard */}
                  <a
                    href={dashboardUrl}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition-colors text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>🏠</span> Dashboard
                  </a>

                  {/* Profile */}
                  <a
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition-colors text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>👤</span> My Profile
                  </a>

                  {/* Logout */}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}