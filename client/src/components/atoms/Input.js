import React from "react";

export default function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-slate-600">{label}</label>}
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}
