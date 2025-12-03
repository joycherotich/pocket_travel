import React, { useState } from "react";
import axios from "axios";

export default function Hotel() {
  const [country, setCountry] = useState("KE");
  const [hotels, setHotels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

//   const API_KEY = "c27926e60dmsh4d20b75e5eb94c4p17b800jsnc4574c31f658";
  const API_KEY = "739e992944msh912eb90130c1b60p12f307jsncf5a6755fb38";
  const API_HOST = "booking-com15.p.rapidapi.com";

  const cityDestinations = {
    KE: "-2141754", // Kenya
    TZ: "-184742", // Tanzania
    UG: "-172239", // Uganda
    RW: "-171264", // Rwanda
    IN: "-2106102", // India
    US: "20088325", // USA
    AE: "-782831",
  };

  const currencyByCountry = {
    KE: "USD",
    TZ: "USD",
    UG: "USD",
    RW: "USD",
    IN: "INR",
    US: "USD",
    AE: "AED",
  };

  const formatDate = (d) => d.toISOString().slice(0, 10);

  const loadHotels = async () => {
    setErrorMsg("");
    setLoading(true);
    setFiltered([]);
    setSelected(null);

    const dest_id = cityDestinations[country];
    const currency = currencyByCountry[country];

    const today = new Date();
    const arrival = new Date(today);
    arrival.setDate(today.getDate() + 7);
    const departure = new Date(today);
    departure.setDate(today.getDate() + 8);

    try {
      const response = await axios.get(
        `https://${API_HOST}/api/v1/hotels/searchHotels`,
        {
          params: {
            dest_id,
            search_type: "CITY",
            adults: "1",
            room_qty: "1",
            arrival_date: formatDate(arrival),
            departure_date: formatDate(departure),
            languagecode: "en-us",
            currency_code: currency,
          },
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        }
      );

      // console.log("API Response:", response.data);

      const hotelList = response?.data?.data?.hotels || [];

      if (hotelList.length === 0) {
        setErrorMsg("No hotels found for this city.");
        setLoading(false);
        return;
      }

      setHotels(hotelList);
      setFiltered(hotelList);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load hotels.");
      setLoading(false);
    }
  };

  const filterHotels = () => {
    const txt = search.trim().toLowerCase();
    if (!txt) return setFiltered(hotels);

    setFiltered(
      hotels.filter((h) =>
        h?.name?.toLowerCase()?.includes(txt)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-[Poppins]">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center select-none">
        🌍 Global Hotel Search
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center max-w-5xl mx-auto">
        <select
          className="border border-blue-300 p-3 rounded-lg shadow-sm hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Select country"
        >
          <option value="KE">Kenya</option>
          <option value="TZ">Tanzania</option>
          <option value="UG">Uganda</option>
          <option value="RW">Rwanda</option>
          <option value="IN">India</option>
          <option value="AE">UAE</option>
          <option value="US">USA</option>
        </select>

        <button
          onClick={loadHotels}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition select-none"
          aria-busy={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading spinner"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Load Hotels"
          )}
        </button>

        <input
          type="text"
          placeholder="Search hotel by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && filterHotels()}
          aria-label="Search hotel"
        />

        <button
          onClick={filterHotels}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition select-none"
        >
          Search
        </button>
      </div>

      {errorMsg && (
        <div className="max-w-5xl mx-auto bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-8 shadow-sm select-none">
          {errorMsg}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((hotel) => {
          const p = hotel.property;
          const img = p?.photoUrls?.[0] || "https://via.placeholder.com/400x250?text=No+Image";

          return (
            <div
              key={hotel.hotel_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.03] transform transition duration-300"
              onClick={() => setSelected(hotel)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelected(hotel)}
              aria-label={`View details for ${p?.name}`}
            >
              <img
                src={img}
                alt={p?.name}
                className="w-full h-56 object-cover"
                loading="lazy"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 truncate">{p?.name}</h2>

                <p className="text-yellow-600 font-semibold mb-1">
                  ⭐ {p?.reviewScore?.toFixed(1) || "N/A"} / 10
                </p>

                <p className="text-gray-500 text-sm mb-3">{p?.reviewCount} reviews</p>

                <p className="text-gray-600 text-sm truncate">
                  {p?.wishlistName || "Location info unavailable"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hotel-modal-title"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              onClick={() => setSelected(null)}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {(() => {
              const p = selected.property;
              const img = p?.photoUrls?.[0] || "https://via.placeholder.com/600x400?text=No+Image";

              return (
                <>
                  <h2
                    id="hotel-modal-title"
                    className="text-3xl font-bold mb-4 text-gray-900 select-text"
                  >
                    {p?.name}
                  </h2>

                  <img
                    src={img}
                    alt={p?.name}
                    className="w-full rounded-lg mb-5 object-cover max-h-72 mx-auto"
                    loading="lazy"
                  />

                  <p className="text-gray-700 mb-2 font-medium">
                    ⭐ Rating:{" "}
                    <span className="text-yellow-600">{p?.reviewScore?.toFixed(1) || "N/A"}</span>{" "}
                    ({p?.reviewCount} reviews)
                  </p>

                  <p className="text-gray-700 mb-2 font-medium">
                    🏨 Stars:{" "}
                    <span>{p?.propertyClass || "N/A"}</span>
                  </p>

                  <p className="text-gray-700 mb-2 font-medium">
                    📍 Location:{" "}
                    <span>{p?.wishlistName || "Unknown"}</span>
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
