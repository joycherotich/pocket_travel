import React from "react";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

export default function PackageCard({ pkg, onSelect }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <p className="text-slate-600 text-sm mt-1">{pkg.location}</p>
        <Badge text={`${pkg.days} days`} color="blue" />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-bold text-blue-600">${pkg.price}</span>
        <Button onClick={() => onSelect(pkg)}>View</Button>
      </div>
    </div>
  );
}
