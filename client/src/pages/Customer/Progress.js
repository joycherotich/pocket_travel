import React from "react";
import { FaCheckCircle, FaPlaneDeparture, FaHotel, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function Progress() {
  // Example progress data
  const progressSteps = [
    { id: 1, title: "Trip Booked", icon: <FaPlaneDeparture />, status: "completed", date: "Oct 20, 2025" },
    { id: 2, title: "Payment Confirmed", icon: <FaCheckCircle />, status: "completed", date: "Oct 21, 2025" },
    { id: 3, title: "Hotel Reserved", icon: <FaHotel />, status: "in-progress", date: "Pending" },
    { id: 4, title: "Departure Scheduled", icon: <FaCalendarAlt />, status: "pending", date: "Nov 10, 2025" },
  ];

  return (
    <div className="font-[Poppins] px-2 sm:px-4 md:px-8">
      <h2 className="text-2xl font-bold text-yellow-700 mb-8">My Trip Progress</h2>

      <ol className="relative border-l border-yellow-300 ml-4">
        {progressSteps.map((step) => (
          <li key={step.id} className="mb-10 ml-6">
            <span
              className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ${
                step.status === "completed"
                  ? "bg-green-500 ring-green-100 text-white"
                  : step.status === "in-progress"
                  ? "bg-yellow-500 ring-yellow-100 text-white"
                  : "bg-gray-300 ring-gray-100 text-gray-600"
              }`}
            >
              {step.icon}
            </span>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FaClock size={12} /> {step.date}
              </span>
            </div>

            <p
              className={`text-sm mt-1 ${
                step.status === "completed"
                  ? "text-green-600"
                  : step.status === "in-progress"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {step.status === "completed"
                ? "Done"
                : step.status === "in-progress"
                ? "Ongoing"
                : "Pending"}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
