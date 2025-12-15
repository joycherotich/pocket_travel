import React, { useState, useEffect } from "react";
import { FaFileCsv, FaFilter } from "react-icons/fa";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports?type=${filter}`);
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [filter]);

  const filteredReports = reports.filter((report) =>
    Object.values(report).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);
  const displayedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const csv = [
      Object.keys(reports[0] || {}).join(","),
      ...reports.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    link.click();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Reports</h2>

      {/* Filters & Export */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex gap-2 items-center">
          <FaFilter className="text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Reports</option>
            <option value="clients">Clients</option>
            <option value="payments">Payments</option>
            <option value="packages">Packages</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        />

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaFileCsv /> Export CSV
        </button>
      </div>

      {loading ? (
        <div>Loading reports...</div>
      ) : displayedReports.length === 0 ? (
        <div className="text-gray-500">No reports found.</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-100 rounded-t-lg">
              <tr>
                {Object.keys(displayedReports[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {key.replace("_", " ").charAt(0).toUpperCase() +
                      key.replace("_", " ").slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedReports.map((report, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  {Object.entries(report).map(([key, value]) => (
                    <td key={key} className="px-6 py-4 text-sm text-gray-700">
                      {typeof value === "string" && value.includes("high") ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {value}
                        </span>
                      ) : typeof value === "string" && value.includes("medium") ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {value}
                        </span>
                      ) : typeof value === "string" && value.includes("low") ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-400 hover:text-white transition"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
