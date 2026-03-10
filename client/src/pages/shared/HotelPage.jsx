import React, { useState, useEffect } from "react";

// ─── Mock Data (used when backend is unavailable) ─────────────────────────────
const MOCK_CITIES = [
  { cityCode: "NBO", name: "Nairobi",      country: "Kenya" },
  { cityCode: "MBA", name: "Mombasa",      country: "Kenya" },
  { cityCode: "PAR", name: "Paris",        country: "France" },
  { cityCode: "LON", name: "London",       country: "United Kingdom" },
  { cityCode: "NYC", name: "New York",     country: "United States" },
  { cityCode: "DXB", name: "Dubai",        country: "UAE" },
  { cityCode: "JNB", name: "Johannesburg", country: "South Africa" },
  { cityCode: "CPT", name: "Cape Town",    country: "South Africa" },
  { cityCode: "SYD", name: "Sydney",       country: "Australia" },
  { cityCode: "TYO", name: "Tokyo",        country: "Japan" },
  { cityCode: "BKK", name: "Bangkok",      country: "Thailand" },
  { cityCode: "IST", name: "Istanbul",     country: "Turkey" },
  { cityCode: "ROM", name: "Rome",         country: "Italy" },
  { cityCode: "BCN", name: "Barcelona",    country: "Spain" },
  { cityCode: "MIA", name: "Miami",        country: "United States" },
];

const MOCK_HOTELS_BY_CITY = {
  NBO: [
    { hotelId:"NBO001", name:"Serena Hotel Nairobi",    address:"Processional Way",  country:"Kenya", distance:"0.5 km",  stars:5, pricePerNight:320, phone:"+254 20 2822000",  email:"reservations@serena.co.ke",      website:"serenahotels.com" },
    { hotelId:"NBO002", name:"Villa Rosa Kempinski",     address:"Waiyaki Way",       country:"Kenya", distance:"1.2 km",  stars:5, pricePerNight:280, phone:"+254 703 049000",  email:"reservations.nairobi@kempinski.com", website:"kempinski.com" },
    { hotelId:"NBO003", name:"Radisson Blu Nairobi",     address:"Upper Hill Road",   country:"Kenya", distance:"2.0 km",  stars:4, pricePerNight:160, phone:"+254 20 2923000",  email:"info.nairobi@radissonblu.com",   website:"radissonhotels.com" },
    { hotelId:"NBO004", name:"Tribe Hotel",              address:"Limuru Road",       country:"Kenya", distance:"3.5 km",  stars:5, pricePerNight:250, phone:"+254 20 7200000",  email:"stay@tribehotel.co.ke",          website:"tribehotel.co.ke" },
    { hotelId:"NBO005", name:"Ole Sereni",               address:"Mombasa Road",      country:"Kenya", distance:"4.0 km",  stars:4, pricePerNight:140, phone:"+254 20 2003090",  email:"info@olesereni.com",             website:"olesereni.com" },
    { hotelId:"NBO006", name:"Nairobi Sarova Stanley",   address:"Kimathi Street",    country:"Kenya", distance:"0.8 km",  stars:4, pricePerNight:150, phone:"+254 20 2757000",  email:"stanley@sarova.com",             website:"sarovahotels.com" },
  ],
  MBA: [
    { hotelId:"MBA001", name:"Serena Beach Resort",       address:"Shanzu Beach",      country:"Kenya", distance:"1.0 km",  stars:5, pricePerNight:290, phone:"+254 41 5485721",  email:"beach@serena.co.ke",             website:"serenahotels.com" },
    { hotelId:"MBA002", name:"Diamonds Dream of Africa",  address:"Diani Beach",       country:"Kenya", distance:"2.5 km",  stars:5, pricePerNight:310, phone:"+254 40 3202070",  email:"reservations@diamonds-africa.com", website:"diamonds-thug.com" },
    { hotelId:"MBA003", name:"Leopard Beach Resort",      address:"Diani Beach Road",  country:"Kenya", distance:"3.0 km",  stars:4, pricePerNight:180, phone:"+254 40 3202635",  email:"info@leopardbeachresort.com",    website:"leopardbeachresort.com" },
    { hotelId:"MBA004", name:"Baobab Beach Resort",       address:"Diani Beach",       country:"Kenya", distance:"3.5 km",  stars:4, pricePerNight:170, phone:"+254 40 3202630",  email:"info@baobabkenya.com",           website:"baobabkenya.com" },
  ],
  PAR: [
    { hotelId:"PAR001", name:"Hôtel Plaza Athénée",       address:"Avenue Montaigne",  country:"France", distance:"1.0 km", stars:5, pricePerNight:1100, phone:"+33 1 53 67 66 65", email:"reservations@plaza-athenee-paris.com", website:"dorchestercollection.com" },
    { hotelId:"PAR002", name:"Le Meurice",                address:"Rue de Rivoli",     country:"France", distance:"0.5 km", stars:5, pricePerNight:980,  phone:"+33 1 44 58 10 10", email:"reservations@lemeurice.com",     website:"lemeurice.com" },
    { hotelId:"PAR003", name:"Novotel Paris Centre",      address:"Rue du Théâtre",    country:"France", distance:"2.0 km", stars:4, pricePerNight:220,  phone:"+33 1 40 58 20 00", email:"h0785@accor.com",               website:"novotel.com" },
    { hotelId:"PAR004", name:"Hôtel de Crillon",          address:"Place de la Concorde", country:"France", distance:"0.8 km", stars:5, pricePerNight:1400, phone:"+33 1 44 71 15 00", email:"reservations@crillon.com",   website:"rosewoodhotels.com" },
  ],
  LON: [
    { hotelId:"LON001", name:"The Savoy",                 address:"Strand",            country:"UK",    distance:"0.3 km",  stars:5, pricePerNight:750,  phone:"+44 20 7836 4343", email:"savoy@fairmont.com",             website:"thesavoylondon.com" },
    { hotelId:"LON002", name:"Claridge's",                address:"Brook Street",      country:"UK",    distance:"0.6 km",  stars:5, pricePerNight:890,  phone:"+44 20 7629 8860", email:"info@claridges.co.uk",           website:"claridges.co.uk" },
    { hotelId:"LON003", name:"Premier Inn London",        address:"County Hall",       country:"UK",    distance:"1.5 km",  stars:3, pricePerNight:120,  phone:"+44 333 234 6261", email:"premierinn@whitbread.com",       website:"premierinn.com" },
    { hotelId:"LON004", name:"The Ritz London",           address:"Piccadilly",        country:"UK",    distance:"0.9 km",  stars:5, pricePerNight:1050, phone:"+44 20 7493 8181", email:"enquire@theritzlondon.com",      website:"theritzlondon.com" },
  ],
  NYC: [
    { hotelId:"NYC001", name:"The Plaza Hotel",           address:"Fifth Avenue",      country:"USA",   distance:"0.1 km",  stars:5, pricePerNight:795,  phone:"+1 212 759 3000",  email:"reservations@theplaza.com",      website:"theplazany.com" },
    { hotelId:"NYC002", name:"The Standard High Line",    address:"Washington Street", country:"USA",   distance:"2.0 km",  stars:4, pricePerNight:340,  phone:"+1 212 645 4646",  email:"highline@standardhotels.com",    website:"standardhotels.com" },
    { hotelId:"NYC003", name:"Marriott Marquis",          address:"Broadway",          country:"USA",   distance:"0.8 km",  stars:4, pricePerNight:310,  phone:"+1 212 398 1900",  email:"mhrs.nycmq.reservations@marriott.com", website:"marriott.com" },
    { hotelId:"NYC004", name:"The Bowery Hotel",          address:"Bowery",            country:"USA",   distance:"2.5 km",  stars:4, pricePerNight:380,  phone:"+1 212 505 9100",  email:"info@theboweryhotel.com",        website:"theboweryhotel.com" },
  ],
  DXB: [
    { hotelId:"DXB001", name:"Burj Al Arab",              address:"Jumeirah Beach Rd", country:"UAE",   distance:"1.0 km",  stars:5, pricePerNight:1800, phone:"+971 4 301 7777",  email:"baainfo@jumeirah.com",           website:"jumeirah.com" },
    { hotelId:"DXB002", name:"Atlantis The Palm",         address:"Palm Jumeirah",     country:"UAE",   distance:"5.0 km",  stars:5, pricePerNight:650,  phone:"+971 4 426 0000",  email:"reservations@atlantisthepalm.com", website:"atlantisthepalm.com" },
    { hotelId:"DXB003", name:"Rove Downtown",             address:"Sheikh Zayed Rd",   country:"UAE",   distance:"2.0 km",  stars:3, pricePerNight:95,   phone:"+971 4 561 9000",  email:"downtown@rovehotels.com",        website:"rovehotels.com" },
    { hotelId:"DXB004", name:"Address Downtown",          address:"Downtown Dubai",    country:"UAE",   distance:"1.5 km",  stars:5, pricePerNight:520,  phone:"+971 4 436 8888",  email:"reservations.adb@addresshotels.ae", website:"addresshotels.ae" },
  ],
  JNB: [
    { hotelId:"JNB001", name:"Saxon Hotel Villas & Spa",  address:"Sandhurst",         country:"SA",    distance:"3.5 km",  stars:5, pricePerNight:480,  phone:"+27 11 292 6000",  email:"reservations@saxon.co.za",       website:"saxon.co.za" },
    { hotelId:"JNB002", name:"Protea Hotel Fire & Ice",   address:"Melrose Arch",      country:"SA",    distance:"4.0 km",  stars:4, pricePerNight:160,  phone:"+27 11 214 6000",  email:"fireandice@proteahotels.com",    website:"marriott.com" },
    { hotelId:"JNB003", name:"Michelangelo Hotel",        address:"Sandton",           country:"SA",    distance:"2.0 km",  stars:5, pricePerNight:320,  phone:"+27 11 282 7000",  email:"michelangelo@tsogosun.com",      website:"tsogosun.com" },
  ],
  CPT: [
    { hotelId:"CPT001", name:"The Silo Hotel",            address:"V&A Waterfront",    country:"SA",    distance:"0.5 km",  stars:5, pricePerNight:680,  phone:"+27 21 670 0500",  email:"reservations@thesilohotel.com",  website:"thesilohotel.com" },
    { hotelId:"CPT002", name:"Belmond Mount Nelson",      address:"Orange Street",     country:"SA",    distance:"1.0 km",  stars:5, pricePerNight:590,  phone:"+27 21 483 1000",  email:"mountnelsonres@belmond.com",     website:"belmond.com" },
    { hotelId:"CPT003", name:"Radisson Blu Cape Town",    address:"Granger Bay",       country:"SA",    distance:"1.5 km",  stars:4, pricePerNight:220,  phone:"+27 21 441 3000",  email:"info.capetown@radissonblu.com",  website:"radissonhotels.com" },
  ],
  SYD: [
    { hotelId:"SYD001", name:"Park Hyatt Sydney",         address:"The Rocks",         country:"Australia", distance:"0.3 km", stars:5, pricePerNight:720, phone:"+61 2 9256 1234", email:"sydney.park@hyatt.com",         website:"hyatt.com" },
    { hotelId:"SYD002", name:"QT Sydney",                 address:"Market Street",     country:"Australia", distance:"0.8 km", stars:4, pricePerNight:290, phone:"+61 2 8262 0000", email:"qtsydney@qthotels.com.au",      website:"qthotels.com.au" },
  ],
  TYO: [
    { hotelId:"TYO001", name:"The Peninsula Tokyo",       address:"Marunouchi",        country:"Japan", distance:"0.5 km",  stars:5, pricePerNight:680,  phone:"+81 3 6270 2888",  email:"ptyo@peninsula.com",             website:"peninsula.com" },
    { hotelId:"TYO002", name:"Park Hyatt Tokyo",          address:"Shinjuku",          country:"Japan", distance:"3.0 km",  stars:5, pricePerNight:590,  phone:"+81 3 5322 1234",  email:"tokyo.park@hyatt.com",           website:"hyatt.com" },
    { hotelId:"TYO003", name:"APA Hotel Shinjuku",        address:"Kabukicho",         country:"Japan", distance:"2.5 km",  stars:3, pricePerNight:90,   phone:"+81 3 5291 6711",  email:"info@apahotel.com",              website:"apahotel.com" },
  ],
  BKK: [
    { hotelId:"BKK001", name:"Mandarin Oriental Bangkok", address:"Oriental Avenue",   country:"Thailand", distance:"0.8 km", stars:5, pricePerNight:450, phone:"+66 2 659 9000",  email:"mobkk-reservations@mohg.com",   website:"mandarinoriental.com" },
    { hotelId:"BKK002", name:"The Peninsula Bangkok",     address:"Charoen Nakhon",    country:"Thailand", distance:"1.5 km", stars:5, pricePerNight:390, phone:"+66 2 020 2888",  email:"pbkk@peninsula.com",            website:"peninsula.com" },
    { hotelId:"BKK003", name:"Ibis Bangkok Riverside",   address:"Charoen Nakhon",    country:"Thailand", distance:"2.0 km", stars:3, pricePerNight:65,  phone:"+66 2 659 2888",  email:"h6207@accor.com",               website:"ibis.com" },
  ],
};

// Enrich Amadeus API results (which lack contact/price) with deterministic data
const COUNTRY_CODES = { KE:"+254", FR:"+33", GB:"+44", US:"+1", AE:"+971", ZA:"+27", AU:"+61", JP:"+81", TH:"+66", DE:"+49", IT:"+39", ES:"+34", TR:"+90" };
function enrichHotel(h) {
  if (h.pricePerNight) return h; // already has data
  const base = h.stars >= 5 ? 350 : h.stars >= 4 ? 180 : 85;
  const seed = (h.hotelId || h.name || "x").split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const variance = ((seed % 20) - 10) / 100; // ±10%
  const price = Math.round(base * (1 + variance));
  const cc = COUNTRY_CODES[h.country] || "+1";
  const num = 200000000 + (seed % 99999999);
  return {
    ...h,
    pricePerNight: price,
    phone: `${cc} ${num}`.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3"),
    email: `reservations@${(h.name||"hotel").toLowerCase().replace(/[^a-z]/g,"")}.com`,
    website: `${(h.name||"hotel").toLowerCase().replace(/[^a-z]/g,"")}.com`,
  };
}

function buildMockOffers(hotel, checkIn, checkOut, adults) {
  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const base = hotel.stars >= 5 ? 280 : hotel.stars >= 4 ? 150 : 75;
  return {
    hotelId:     hotel.hotelId,
    name:        hotel.name,
    cityCode:    hotel.address,
    rating:      hotel.stars,
    phone:       hotel.phone,
    email:       hotel.email,
    website:     hotel.website,
    description: `Welcome to ${hotel.name}. Enjoy world-class hospitality in the heart of ${hotel.address}. Our award-winning property blends modern luxury with local character, offering an unforgettable stay.`,
    amenities:   ["WIFI","SWIMMING_POOL","FITNESS_CENTER","RESTAURANT","PARKING","SPA","AIR_CONDITIONING","ROOM_SERVICE","BAR or LOUNGE","MEETING_ROOMS"],
    photos:      [],
    offers: [
      {
        offerId:  `${hotel.hotelId}-STD`,
        roomType: "Standard Room",
        bedType:  "Double Bed",
        adults:   Number(adults),
        boardType:"ROOM_ONLY",
        checkIn, checkOut,
        currency: "USD",
        price:    (base * nights * Number(adults)).toFixed(2),
      },
      {
        offerId:  `${hotel.hotelId}-DLX`,
        roomType: "Deluxe Room",
        bedType:  "King Bed",
        adults:   Number(adults),
        boardType:"BREAKFAST_INCLUDED",
        checkIn, checkOut,
        currency: "USD",
        price:    (base * 1.4 * nights * Number(adults)).toFixed(2),
      },
      ...(hotel.stars >= 4 ? [{
        offerId:  `${hotel.hotelId}-STE`,
        roomType: "Junior Suite",
        bedType:  "King Bed",
        adults:   Number(adults),
        boardType:"HALF_BOARD",
        checkIn, checkOut,
        currency: "USD",
        price:    (base * 2.2 * nights * Number(adults)).toFixed(2),
      }] : []),
    ],
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const API = "http://localhost:5000";

const AMENITY_OPTIONS = [
  "SWIMMING_POOL","SPA","FITNESS_CENTER","AIR_CONDITIONING","RESTAURANT",
  "PARKING","PETS_ALLOWED","AIRPORT_SHUTTLE","WIFI","BEACH","CASINO",
  "JACUZZI","SAUNA","MASSAGE","BAR or LOUNGE","MINIBAR","ROOM_SERVICE","KIDS_WELCOME",
];
const AMENITY_ICONS = {
  SWIMMING_POOL:"🏊",SPA:"💆",FITNESS_CENTER:"🏋️",AIR_CONDITIONING:"❄️",
  RESTAURANT:"🍽️",PARKING:"🅿️",PETS_ALLOWED:"🐾",AIRPORT_SHUTTLE:"🚌",
  WIFI:"📶",BEACH:"🏖️",CASINO:"🎰",JACUZZI:"🛁",SAUNA:"🧖",MASSAGE:"💆",
  "BAR or LOUNGE":"🍸",MINIBAR:"🍹",ROOM_SERVICE:"🛎️",KIDS_WELCOME:"👶",
  BUSINESS_CENTER:"💼",MEETING_ROOMS:"🤝",TENNIS:"🎾",GOLF:"⛳",
};

// Curated, stable Unsplash photo IDs — grouped by star rating
const HOTEL_PHOTOS = {
  5: [
    "photo-1566073771259-6a8506099945", // infinity pool resort
    "photo-1551882547-ff40c63fe5fa",    // luxury hotel exterior
    "photo-1520250497591-112f2f40a3f4", // resort pool sunset
    "photo-1571896349842-33c89424de2d", // clifftop luxury resort
    "photo-1563911302283-d2bc129e7570", // night pool luxury
    "photo-1606402179428-a57976d71fa4", // rooftop pool city
    "photo-1582719508461-905c673771fd", // beach resort
    "photo-1618773928121-c32242e63f39", // luxury bedroom suite
  ],
  4: [
    "photo-1542314831-068cd1dbfeeb",    // hotel lobby warm
    "photo-1584132967334-10e028bd69f7", // modern hotel exterior
    "photo-1455587734955-081b22074882", // hotel room king
    "photo-1631049307264-da0ec9d70304", // hotel interior design
    "photo-1445019980597-93fa8acb246c", // hotel room window view
    "photo-1549294413-26f195200c16",    // hotel corridor elegant
  ],
  3: [
    "photo-1522798514-97ceb8c4f1c8",    // clean modern room
    "photo-1506059612708-99d6d2a6d3b7", // hotel double room
    "photo-1574643156929-51fa098b0394", // simple hotel room
    "photo-1416331108676-a22ccb276e35", // hotel exterior classic
  ],
};

const hotelPhoto = (nameOrId, stars = 4) => {
  const pool = HOTEL_PHOTOS[Math.min(Math.max(Math.round(stars), 3), 5)] || HOTEL_PHOTOS[4];
  // deterministic pick based on name/id string
  const hash = (nameOrId || "hotel").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const id = pool[hash % pool.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=240&q=80`;
};

const renderStars = (n) => "⭐".repeat(Math.min(Number(n) || 0, 5));

// ─── Lightweight toast ────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  return { toasts, success:(m)=>add(m,"success"), error:(m)=>add(m,"error"), info:(m)=>add(m,"info") };
}
function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} style={{animation:"slideIn .25s ease"}}
          className={`px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white
            ${t.type==="success"?"bg-emerald-500/90":t.type==="error"?"bg-red-500/90":"bg-gray-700/90"}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HotelPage() {
  // Gracefully handle missing AuthContext
  let isAdmin = false;
  try {
    // eslint-disable-next-line
    const ctx = require("../../context/AuthContext");
    isAdmin = ctx?.useAuth?.()?.user?.role === "admin";
  } catch {}

  const toast = useToast();
  const [tab, setTab] = useState("search");

  // Our Hotels
  const [hotels, setHotels]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm] = useState({ name:"", location:"", stars:"3", price:"", rooms:"", description:"" });

  // Search inputs
  const [cityInput, setCityInput]   = useState("");
  const [hotelInput, setHotelInput] = useState("");
  const [checkIn, setCheckIn]       = useState("");
  const [checkOut, setCheckOut]     = useState("");
  const [adults, setAdults]         = useState(1);

  // Filters
  const [showFilters, setShowFilters]             = useState(false);
  const [radius, setRadius]                       = useState(5);
  const [radiusUnit, setRadiusUnit]               = useState("KM");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRatings, setSelectedRatings]     = useState([]);
  const [hotelSource, setHotelSource]             = useState("ALL");

  // Results
  const [cities, setCities]               = useState([]);
  const [selectedCity, setSelectedCity]   = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [offers, setOffers]               = useState(null);

  const [cityLoading, setCityLoading]   = useState(false);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);

  const toggleAmenity = (a) =>
    setSelectedAmenities((p) => p.includes(a) ? p.filter((x)=>x!==a) : [...p,a]);
  const toggleRating = (r) =>
    setSelectedRatings((p) => p.includes(r) ? p.filter((x)=>x!==r) : [...p,r]);
  const activeFilterCount =
    selectedAmenities.length + selectedRatings.length +
    (hotelSource!=="ALL"?1:0) + (radius!==5?1:0);
  const resetFilters = () => {
    setSelectedAmenities([]); setSelectedRatings([]);
    setHotelSource("ALL"); setRadius(5); setRadiusUnit("KM");
  };

  // Our hotels
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/hotels`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch {
      setHotels([
        { _id:"1", name:"Serena Hotel Nairobi",  location:"Nairobi, Kenya",     stars:5, price:320, rooms:184, description:"Iconic luxury in the heart of Nairobi." },
        { _id:"2", name:"Villa Rosa Kempinski",  location:"Westlands, Nairobi", stars:5, price:280, rooms:200, description:"Contemporary luxury at its finest." },
        { _id:"3", name:"Ole Sereni",            location:"Mombasa Road",       stars:4, price:150, rooms:106, description:"Overlooking Nairobi National Park." },
      ]);
    }
    setLoading(false);
  };
  useEffect(() => { fetchHotels(); }, []);

  const filteredLocal = hotels.filter((h) =>
    h.name?.toLowerCase().includes(localSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/hotels`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form),
      });
      if (!res.ok) { toast.error("Failed to add hotel"); return; }
      toast.success("Hotel added ✅");
      setModalOpen(false);
      setForm({ name:"", location:"", stars:"3", price:"", rooms:"", description:"" });
      fetchHotels();
    } catch { toast.error("Server error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await fetch(`${API}/api/hotels/${id}`, { method:"DELETE" });
      toast.success("Deleted"); fetchHotels();
    } catch { toast.error("Delete failed"); }
  };

  // City search
  const searchCity = async () => {
    if (!cityInput.trim()) return toast.error("Enter a city name");
    setCityLoading(true);
    setCities([]); setSelectedCity(null); setSearchResults([]);
    setSelectedHotel(null); setOffers(null);
    try {
      let data = null;
      try {
        const res = await fetch(`${API}/api/hotel-search/city?keyword=${encodeURIComponent(cityInput)}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (Array.isArray(json) && json.length) data = json;
      } catch { /* fall through to mock */ }

      if (!data) {
        const kw = cityInput.trim().toLowerCase();
        data = MOCK_CITIES.filter(
          (c) => c.name.toLowerCase().includes(kw) || c.country.toLowerCase().includes(kw) || c.cityCode.toLowerCase() === kw
        );
      }

      if (!data.length) toast.error("No cities found — try Nairobi, Mombasa, Paris, Dubai…");
      else setCities(data);
    } catch { toast.error("City search failed"); }
    finally { setCityLoading(false); }
  };

  // Hotel search
  const searchHotels = async (city) => {
    setSelectedCity(city); setCities([]);
    setSearchResults([]); setSelectedHotel(null); setOffers(null);
    setHotelLoading(true);
    try {
      let data = null;
      try {
        const params = new URLSearchParams({ cityCode: city.cityCode });
        if (hotelInput.trim())        params.set("keyword", hotelInput.trim());
        if (radius !== 5)             params.set("radius", radius);
        if (radiusUnit !== "KM")      params.set("radiusUnit", radiusUnit);
        if (hotelSource !== "ALL")    params.set("hotelSource", hotelSource);
        if (selectedAmenities.length) params.set("amenities", selectedAmenities.join(","));
        if (selectedRatings.length)   params.set("ratings", selectedRatings.join(","));
        const res = await fetch(`${API}/api/hotel-search/hotels?${params}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (Array.isArray(json) && json.length) data = json;
      } catch { /* fall through */ }

      if (!data) {
        let mock = MOCK_HOTELS_BY_CITY[city.cityCode] || [
          { hotelId:`${city.cityCode}001`, name:`${city.name} Grand Hotel`,   address:"City Center",       country:city.country, distance:"0.5 km", stars:5 },
          { hotelId:`${city.cityCode}002`, name:`${city.name} Park Suites`,   address:"Park Avenue",       country:city.country, distance:"1.2 km", stars:4 },
          { hotelId:`${city.cityCode}003`, name:`${city.name} Business Inn`,  address:"Business District", country:city.country, distance:"1.8 km", stars:3 },
          { hotelId:`${city.cityCode}004`, name:`Marriott ${city.name}`,      address:"Central District",  country:city.country, distance:"2.0 km", stars:4 },
          { hotelId:`${city.cityCode}005`, name:`Hilton ${city.name}`,        address:"Airport Road",      country:city.country, distance:"3.0 km", stars:4 },
          { hotelId:`${city.cityCode}006`, name:`Ibis ${city.name} Centre`,   address:"Main Street",       country:city.country, distance:"0.9 km", stars:3 },
        ];
        if (selectedRatings.length) mock = mock.filter((h) => selectedRatings.includes(String(h.stars)));
        if (hotelInput.trim())       mock = mock.filter((h) => h.name.toLowerCase().includes(hotelInput.toLowerCase()));
        data = mock;
      }

      if (!data.length) toast.error("No hotels match these filters");
      else setSearchResults(data.map(enrichHotel));
    } catch { toast.error("Hotel search failed"); }
    finally { setHotelLoading(false); }
  };

  // Get offers
  const getOffers = async (hotel) => {
    if (!checkIn || !checkOut) return toast.error("Please select check-in and check-out dates");
    if (new Date(checkOut) <= new Date(checkIn)) return toast.error("Check-out must be after check-in");
    setSelectedHotel(hotel); setOfferLoading(true); setOffers(null);
    try {
      let offerData = null;
      try {
        const url = `${API}/api/hotel-search/offers?hotelIds=${hotel.hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (Array.isArray(json) && json.length) offerData = json[0];
      } catch { /* fall through */ }

      if (!offerData) offerData = buildMockOffers(hotel, checkIn, checkOut, adults);
      setOffers(offerData);
    } catch { toast.error("Could not load offers"); setSelectedHotel(null); }
    finally { setOfferLoading(false); }
  };

  const today = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;

  return (
    <div style={{ fontFamily:"'Poppins', sans-serif" }} className="space-y-6 pb-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .card-appear { animation: fadeUp .3s ease both; }
      `}</style>

      <Toasts toasts={toast.toasts} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hotels</h1>
          <p className="text-gray-500 text-sm mt-0.5">Search worldwide or manage partner hotels</p>
        </div>
        {tab === "our" && isAdmin && (
          <button onClick={() => setModalOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow transition">
            + Add Hotel
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-gray-200">
        {[{ key:"our", label:"🏨 Our Hotels" }, { key:"search", label:"🌍 Search Worldwide" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
              tab===t.key ? "border-yellow-500 text-yellow-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB 1: OUR HOTELS ── */}
      {tab === "our" && (
        <>
          <input type="search" placeholder="Search our hotels…" value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          {loading ? (
            <div className="text-center text-gray-400 py-10">Loading hotels…</div>
          ) : filteredLocal.length === 0 ? (
            <div className="text-center text-gray-400 italic py-10">No hotels found.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLocal.map((h, i) => (
                <div key={h._id||i} style={{animationDelay:`${i*60}ms`}}
                  className="card-appear bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <img src={hotelPhoto(h.name, h.stars)} alt={h.name} className="h-40 w-full object-cover"
                    onError={(e)=>{e.target.src=hotelPhoto(h.name+"2", h.stars)}} />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{h.name}</h3>
                      <span className="text-xs">{renderStars(h.stars)}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">📍 {h.location||"—"}</p>
                    {h.description && <p className="text-gray-500 text-xs mt-2 line-clamp-2">{h.description}</p>}
                    <div className="flex justify-between items-center mt-3">
                      {h.price && <span className="text-yellow-700 font-bold text-sm">${h.price}<span className="text-gray-400 font-normal text-xs">/night</span></span>}
                      {h.rooms && <span className="text-xs text-gray-400">{h.rooms} rooms</span>}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={()=>toast.info("Edit coming soon")}
                          className="flex-1 text-xs text-yellow-600 border border-yellow-200 rounded-lg py-1.5 font-semibold hover:bg-yellow-50 transition">Edit</button>
                        <button onClick={()=>handleDelete(h._id)}
                          className="flex-1 text-xs text-red-500 border border-red-100 rounded-lg py-1.5 font-semibold hover:bg-red-50 transition">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB 2: SEARCH WORLDWIDE ── */}
      {tab === "search" && (
        <div className="space-y-6">

          {/* Search form */}
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
            <div>
              <h2 className="font-bold text-gray-700 text-base">🔍 Find Hotels Worldwide</h2>
              <p className="text-xs text-gray-400 mt-0.5">Try: Nairobi · Mombasa · Paris · London · Dubai · Cape Town · Tokyo</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <input type="text" placeholder="City e.g. Nairobi" value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => e.key==="Enter" && searchCity()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <input type="text" placeholder="Hotel name (optional)" value={hotelInput}
                onChange={(e) => setHotelInput(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <div className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-400 px-1">Check-in</label>
                <input type="date" min={today} value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-0.5">
                  <label className="text-xs text-gray-400 px-1">Check-out</label>
                  <input type="date" min={checkIn||today} value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-gray-400 px-1">Guests</label>
                  <select value={adults} onChange={(e) => setAdults(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    {[1,2,3,4,5].map((n)=><option key={n} value={n}>{n} {n===1?"Adult":"Adults"}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Filters toggle */}
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters((v)=>!v)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-yellow-700 transition">
                <span className={`inline-block transition-transform duration-200 ${showFilters?"rotate-90":""}`}>▶</span>
                Advanced Filters
                {activeFilterCount > 0 && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-medium">Reset</button>
              )}
            </div>

            {showFilters && (
              <div className="border border-gray-100 rounded-2xl p-4 space-y-5 bg-gray-50">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Search Radius</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={1} max={50} value={radius}
                        onChange={(e)=>setRadius(Number(e.target.value))} className="flex-1 accent-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700 w-16 text-right">{radius} {radiusUnit}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Unit</label>
                    <div className="flex gap-2">
                      {["KM","MILE"].map((u)=>(
                        <button key={u} onClick={()=>setRadiusUnit(u)}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${radiusUnit===u?"bg-yellow-500 border-yellow-500 text-white":"bg-white border-gray-200 text-gray-600 hover:border-yellow-300"}`}>{u}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Star Rating</label>
                  <div className="flex gap-2 flex-wrap">
                    {["1","2","3","4","5"].map((r)=>(
                      <button key={r} onClick={()=>toggleRating(r)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${selectedRatings.includes(r)?"bg-yellow-500 border-yellow-500 text-white":"bg-white border-gray-200 text-gray-600 hover:border-yellow-300"}`}>
                        {"⭐".repeat(Number(r))}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Hotel Source</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      {value:"ALL",label:"All Sources",desc:"GDS + Aggregators"},
                      {value:"DIRECTCHAIN",label:"Direct / GDS",desc:"Chains & distribution"},
                      {value:"BEDBANK",label:"Bed Banks",desc:"Aggregators only"},
                    ].map((s)=>(
                      <button key={s.value} onClick={()=>setHotelSource(s.value)}
                        className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-left border transition ${hotelSource===s.value?"bg-yellow-500 border-yellow-500 text-white":"bg-white border-gray-200 text-gray-600 hover:border-yellow-300"}`}>
                        <p className="text-xs font-bold">{s.label}</p>
                        <p className={`text-xs mt-0.5 ${hotelSource===s.value?"text-yellow-100":"text-gray-400"}`}>{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Amenities {selectedAmenities.length>0&&<span className="text-yellow-600 normal-case">({selectedAmenities.length} selected)</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a)=>(
                      <button key={a} onClick={()=>toggleAmenity(a)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedAmenities.includes(a)?"bg-yellow-500 border-yellow-500 text-white":"bg-white border-gray-200 text-gray-600 hover:border-yellow-300 hover:bg-yellow-50"
                        }`}>
                        {AMENITY_ICONS[a]||"✓"} {a.replace(/_/g," ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button onClick={searchCity} disabled={cityLoading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow transition flex items-center gap-2">
              {cityLoading ? <><span className="animate-spin inline-block">⏳</span> Searching…</> : "🔍 Search Hotels"}
            </button>
          </div>

          {/* City picker */}
          {cities.length > 0 && (
            <div className="card-appear bg-white rounded-2xl shadow-md p-5">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                {cities.length === 1 ? "Found 1 city — click to see hotels:" : `Select a city (${cities.length} found):`}
              </p>
              <div className="flex flex-wrap gap-2">
                {cities.map((c)=>(
                  <button key={c.cityCode} onClick={()=>searchHotels(c)}
                    className="bg-yellow-50 border border-yellow-300 hover:bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl text-sm font-medium transition">
                    {c.name}, {c.country} <span className="text-yellow-500 text-xs">({c.cityCode})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hotelLoading && (
            <div className="text-center text-gray-400 py-10 animate-pulse">
              🔍 Searching hotels in {selectedCity?.name}…
            </div>
          )}

          {/* Filter chips */}
          {!hotelLoading && searchResults.length > 0 && !selectedHotel && activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Active filters:</span>
              {selectedRatings.map((r)=>(
                <span key={r} className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">{"⭐".repeat(Number(r))}</span>
              ))}
              {selectedAmenities.map((a)=>(
                <span key={a} className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">{AMENITY_ICONS[a]||"✓"} {a.replace(/_/g," ")}</span>
              ))}
              {hotelSource!=="ALL"&&<span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{hotelSource}</span>}
              {radius!==5&&<span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">{radius} {radiusUnit} radius</span>}
            </div>
          )}

          {/* Hotel results */}
          {!hotelLoading && searchResults.length > 0 && !selectedHotel && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                <strong>{searchResults.length}</strong> hotel{searchResults.length!==1?"s":""} in <strong>{selectedCity?.name}</strong>
                {nights > 0 ? ` · ${nights} night${nights!==1?"s":""} · click a hotel to see prices` : " · add dates above, then click a hotel"}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((h, i) => (
                  <div key={h.hotelId} onClick={()=>getOffers(h)}
                    style={{animationDelay:`${i*55}ms`}}
                    className="card-appear bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group">
                    <div className="relative">
                      <img src={hotelPhoto(h.name, h.stars)} alt={h.name}
                        className="h-40 w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e)=>{e.target.src=hotelPhoto(h.hotelId, h.stars)}} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <p className="absolute bottom-2 left-3 text-white text-xs font-medium">📍 {h.address||h.country||"—"}</p>
                      {h.stars && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          {renderStars(h.stars)}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-sm leading-snug">{h.name}</h3>
                      {h.distance && <p className="text-gray-400 text-xs mt-0.5">🚶 {h.distance} from center</p>}

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-yellow-600 font-bold text-base">
                          USD {h.pricePerNight?.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-xs">/night</span>
                      </div>

                      {/* Contact details */}
                      <div className="mt-2 space-y-0.5">
                        {h.phone && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span>📞</span>
                            <a href={`tel:${h.phone}`} onClick={(e)=>e.stopPropagation()}
                              className="hover:text-yellow-600 transition">{h.phone}</a>
                          </p>
                        )}
                        {h.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <span>✉️</span>
                            <a href={`mailto:${h.email}`} onClick={(e)=>e.stopPropagation()}
                              className="hover:text-yellow-600 transition truncate">{h.email}</a>
                          </p>
                        )}
                        {h.website && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span>🌐</span>
                            <a href={`https://${h.website}`} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}
                              className="hover:text-yellow-600 transition truncate">{h.website}</a>
                          </p>
                        )}
                      </div>

                      <span className="mt-3 inline-block bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {nights > 0 ? "Tap for full prices →" : "Add dates for prices"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offerLoading && (
            <div className="text-center text-gray-400 py-10 animate-pulse">
              💰 Loading prices for <strong>{selectedHotel?.name}</strong>…
            </div>
          )}

          {/* Hotel detail & offers */}
          {offers && !offerLoading && (
            <div className="card-appear bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 pt-5">
                <button onClick={()=>{setSelectedHotel(null);setOffers(null);}}
                  className="text-sm text-yellow-600 hover:text-yellow-800 font-semibold transition">
                  ← Back to results
                </button>
              </div>
              <div className="relative mt-3">
                <img src={offers.photos?.length>0?offers.photos[0]:hotelPhoto(offers.name, offers.rating)}
                  alt={offers.name} className="w-full h-64 object-cover"
                  onError={(e)=>{e.target.src=hotelPhoto(offers.hotelId, offers.rating)}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <h2 className="text-2xl font-bold">{offers.name}</h2>
                  <p className="text-sm opacity-80">📍 {offers.cityCode}</p>
                </div>
                {offers.rating && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-teal-900 font-bold text-sm px-3 py-1 rounded-full shadow">
                    {renderStars(offers.rating)}
                  </div>
                )}
              </div>
              <div className="p-6 space-y-5">
                {offers.description && <p className="text-gray-600 text-sm leading-relaxed">{offers.description}</p>}

                {/* Contact details row */}
                {(offers.phone || offers.email || offers.website) && (
                  <div className="bg-gray-50 rounded-xl p-4 grid sm:grid-cols-3 gap-3">
                    {offers.phone && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                        <a href={`tel:${offers.phone}`} className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition">
                          📞 {offers.phone}
                        </a>
                      </div>
                    )}
                    {offers.email && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                        <a href={`mailto:${offers.email}`} className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition break-all">
                          ✉️ {offers.email}
                        </a>
                      </div>
                    )}
                    {offers.website && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Website</p>
                        <a href={`https://${offers.website}`} target="_blank" rel="noreferrer"
                          className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition">
                          🌐 {offers.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {offers.amenities?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {offers.amenities.slice(0,12).map((a)=>(
                        <span key={a} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {AMENITY_ICONS[a]||""} {a.replace(/_/g," ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Available Rooms</p>
                  {nights > 0 && <p className="text-xs text-gray-400 mb-3">📅 {checkIn} → {checkOut} · {nights} night{nights!==1?"s":""} · {adults} guest{Number(adults)>1?"s":""}</p>}
                  <div className="space-y-3">
                    {offers.offers?.map((o)=>(
                      <div key={o.offerId}
                        className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-yellow-300 hover:bg-yellow-50 transition">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-800 text-sm">{o.roomType||"Standard Room"}</p>
                          <p className="text-gray-400 text-xs">🛏 {o.bedType||"—"} · 👤 {o.adults} Adult{o.adults>1?"s":""} · {(o.boardType||"ROOM_ONLY").replace(/_/g," ")}</p>
                          <p className="text-gray-400 text-xs">📅 {o.checkIn} → {o.checkOut}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-yellow-700">{o.currency} {Number(o.price).toLocaleString()}</p>
                          <p className="text-gray-400 text-xs">total stay</p>
                          <button onClick={(e)=>{e.stopPropagation();toast.success("Booking flow coming soon! 🎉")}}
                            className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2 rounded-xl transition">
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add Hotel Modal */}
      {modalOpen && isAdmin && (
        <div onClick={()=>setModalOpen(false)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={(e)=>e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button onClick={()=>setModalOpen(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-xl font-bold text-yellow-700 mb-4">Add Partner Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                {key:"name",label:"Hotel Name *",type:"text"},
                {key:"location",label:"Location",type:"text"},
                {key:"price",label:"Price/night ($)",type:"number"},
                {key:"rooms",label:"Total Rooms",type:"number"},
              ].map((f)=>(
                <input key={f.key} type={f.type} placeholder={f.label} value={form[f.key]}
                  required={f.key==="name"}
                  onChange={(e)=>setForm((p)=>({...p,[f.key]:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              ))}
              <select value={form.stars} onChange={(e)=>setForm((p)=>({...p,stars:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                {["1","2","3","4","5"].map((s)=><option key={s} value={s}>{s} Star{s>"1"?"s":""}</option>)}
              </select>
              <textarea placeholder="Description (optional)" value={form.description} rows={3}
                onChange={(e)=>setForm((p)=>({...p,description:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
              <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">
                Add Hotel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}