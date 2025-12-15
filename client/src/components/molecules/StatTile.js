import React from "react";

export default function StatTile({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
