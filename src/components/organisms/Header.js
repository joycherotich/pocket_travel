import React from "react";
import logo from "../../assets/travel.png"; // your logo image

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl shadow-md z-50 font-[Poppins]">
      <div className="flex justify-between items-center px-6 md:px-16 py-3 transition-all duration-300">
        
        {/* ===== Logo Section ===== */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src={logo}
            alt="JetSet Travel Logo"
            className="h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <span className="hidden sm:block text-2xl font-extrabold tracking-tight text-gray-800">
            Pocket Of Paradise <span className="text-yellow-600">Travel ✈️</span>
          </span>
        </div>

        {/* ===== Navigation Menu ===== */}
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
          <a href="#" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Corporates
          </a>
          <a href="#" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Local
          </a>
          <a href="#" className="hover:text-yellow-600 transition-all duration-200 hover:-translate-y-[1px]">
            Blog
          </a>
        </nav>

        {/* ===== Right Buttons ===== */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="/login"
            className="border border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
          >
            Login
          </a>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            Contact
          </button>
        </div>
      </div>
    </header>
  );
}
