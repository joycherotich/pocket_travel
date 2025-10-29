import React from "react";
import Badge from "../atoms/Badge";

export default function BookingsTable({ bookings = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500 text-left border-b">
          <tr>
            <th className="py-2">#</th>
            <th>Customer</th>
            <th>Package</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className="odd:bg-slate-50">
              <td className="py-2">{i + 1}</td>
              <td>{b.customer}</td>
              <td>{b.pkg}</td>
              <td>{b.date}</td>
              <td><Badge text={b.status} color={b.status === "Confirmed" ? "green" : "gray"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
