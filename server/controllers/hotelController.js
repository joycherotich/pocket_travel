import axios from "axios";
import HotelCache from "../models/HotelCache.js";

const HOST = process.env.RAPIDAPI_HOST;
const KEY = process.env.RAPIDAPI_KEY;

export const searchHotels = async (req, res) => {
  // Simply pass query params through; ensure required params exist (e.g., dest_id)
  try {
    const params = req.query;
    // optional: cache key creation
    const hash = JSON.stringify(params);
    const cached = await HotelCache.findOne({ paramsHash: hash });
    if (cached) return res.json({ cached: true, data: cached.response });

    const url = `https://${HOST}/api/v1/hotels/searchHotels`;
    const { data } = await axios.get(url, {
      params,
      headers: {
        "x-rapidapi-host": HOST,
        "x-rapidapi-key": KEY
      }
    });

    // store in cache
    await HotelCache.create({ destId: params.dest_id || "", paramsHash: hash, response: data, createdAt: new Date() });

    res.json(data);
  } catch (err) {
    console.error("Hotel search error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Hotel search failed", error: err?.response?.data || err.message });
  }
};

export const getHotelDetails = async (req, res) => {
  try {
    const params = req.query;
    const url = `https://${HOST}/api/v1/hotels/getHotelDetails`;
    const { data } = await axios.get(url, {
      params,
      headers: {
        "x-rapidapi-host": HOST,
        "x-rapidapi-key": KEY
      }
    });
    res.json(data);
  } catch (err) {
    console.error("Hotel details error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Hotel details failed", error: err?.response?.data || err.message });
  }
};
