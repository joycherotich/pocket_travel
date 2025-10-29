import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ links }) {
  return (
    <aside className="bg-white w-64 h-screen shadow-md p-4">
      <h2 className="font-bold text-lg mb-4 text-blue-700">Dashboard</h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.path}>
            <Link to={l.path} className="block py-2 px-3 rounded hover:bg-blue-50">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
