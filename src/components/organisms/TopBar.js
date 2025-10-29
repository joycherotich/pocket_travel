import React from "react";
import { FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-yellow-700 text-white text-sm py-2 px-6 flex justify-between items-center w-full">
      <p>Bonfire Adventures, Kenya’s leading Tour & Travel Company.</p>
      <div className="flex items-center space-x-4">
        <span className="flex items-center gap-1">
          <FaPhoneAlt className="text-white" /> +254 729 836 336
        </span>
        <div className="flex space-x-3 text-white">
          <a href="#" className="hover:text-yellow-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-yellow-300"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-300"><FaInstagram /></a>
        </div>
      </div>
    </div>
  );
}
