import express from "express";
import Amadeus from "amadeus";

const router = express.Router();

const amadeus = new Amadeus({
  clientId:     process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname:     "test", // change to "production" when you go live
});

/* ─────────────────────────────────────────────────────────────
   GET /api/hotel-search/city?keyword=Nairobi
   Find city IATA code from a city name
───────────────────────────────────────────────────────────── */
router.get("/city", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ message: "keyword is required" });

    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: "CITY",
    });

    const cities = (response.data || []).map((c) => ({
      name:     c.name,
      cityCode: c.iataCode,
      country:  c.address?.countryName || "",
    }));

    res.json(cities);
  } catch (err) {
    console.error("City search error:", err?.response?.data || err.message);
    res.status(500).json({ message: "City search failed", error: err?.response?.data || err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/hotel-search/hotels
     ?cityCode=NBO          ← required
     &radius=5              ← optional, default 5
     &radiusUnit=KM         ← KM or MILE
     &ratings=3,4,5         ← star filter
     &amenities=WIFI,POOL   ← amenity filter
     &keyword=serena        ← name filter (applied after fetch)

   Uses: GET /v1/reference-data/locations/hotels/by-city
───────────────────────────────────────────────────────────── */
router.get("/hotels", async (req, res) => {
  try {
    const {
      cityCode,
      radius      = "5",
      radiusUnit  = "KM",
      ratings,
      amenities,
      chainCodes,
      keyword,          // ← NOT sent to Amadeus, filtered manually
    } = req.query;

    if (!cityCode) return res.status(400).json({ message: "cityCode is required" });

    // Build only the params the API actually supports
    const params = {
      cityCode,
      radius,
      radiusUnit,
      hotelSource: "ALL",
    };

    if (ratings)    params.ratings    = ratings;     // e.g. "3,4,5"
    if (amenities)  params.amenities  = amenities;   // e.g. "WIFI,SPA"
    if (chainCodes) params.chainCodes = chainCodes;

    const response = await amadeus.referenceData.locations.hotels.byCity.get(params);

    let hotels = (response.data || []).map((h) => ({
      hotelId:   h.hotelId,
      name:      h.name,
      cityCode:  h.iataCode,
      latitude:  h.geoCode?.latitude  ?? null,
      longitude: h.geoCode?.longitude ?? null,
      address:   Array.isArray(h.address?.lines)
                   ? h.address.lines.join(", ")
                   : (h.address?.lines || ""),
      country:   h.address?.countryCode || "",
      distance:  h.distance
                   ? `${h.distance.value} ${h.distance.unit}`
                   : null,
      dupeId:    h.dupeId || null,
    }));

    // Filter by hotel name if keyword provided
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      hotels = hotels.filter((h) => h.name?.toLowerCase().includes(kw));
    }

    res.json(hotels);
  } catch (err) {
    console.error("Hotel list error:", err?.response?.data || err.message);
    res.status(500).json({
      message: "Hotel search failed",
      error:   err?.response?.data || err.message,
    });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/hotel-search/offers
     ?hotelIds=MSNYCMAR     ← required (comma-separated for multiple)
     &checkIn=2025-12-01    ← required
     &checkOut=2025-12-05   ← required
     &adults=2              ← optional, default 1
     &currency=USD          ← optional, default USD

   Uses: GET /v2/shopping/hotel-offers
───────────────────────────────────────────────────────────── */
router.get("/offers", async (req, res) => {
  try {
    const {
      hotelIds,
      checkIn,
      checkOut,
      adults   = 1,
      currency = "USD",
    } = req.query;

    if (!hotelIds || !checkIn || !checkOut) {
      return res.status(400).json({ message: "hotelIds, checkIn and checkOut are required" });
    }

    const response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds,
      checkInDate:  checkIn,
      checkOutDate: checkOut,
      adults,
      currency,
      bestRateOnly: true,
    });

    const result = (response.data || []).map((h) => ({
      hotelId:     h.hotel.hotelId,
      name:        h.hotel.name,
      cityCode:    h.hotel.cityCode,
      rating:      h.hotel.rating     || null,
      description: h.hotel.description?.text || "",
      amenities:   h.hotel.amenities  || [],
      photos:      (h.hotel.media || []).map((m) => m.uri),
      latitude:    h.hotel.latitude   || null,
      longitude:   h.hotel.longitude  || null,
      offers: (h.offers || []).map((o) => ({
        offerId:   o.id,
        checkIn:   o.checkInDate,
        checkOut:  o.checkOutDate,
        adults:    o.guests?.adults || 1,
        price:     o.price.total,
        currency:  o.price.currency,
        roomType:  o.room?.typeEstimated?.category || "Standard Room",
        bedType:   o.room?.typeEstimated?.bedType  || "",
        beds:      o.room?.typeEstimated?.beds     || "",
        boardType: o.boardType || "ROOM_ONLY",
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error("Hotel offers error:", err?.response?.data || err.message);
    res.status(500).json({
      message: "Hotel offers failed",
      error:   err?.response?.data || err.message,
    });
  }
});

export default router;