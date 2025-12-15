import React from "react";

export default function Badge({ text, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${colors[color] || colors.gray}`}>
      {text}
    </span>
  );
}
