/**
 * server/utils/mpesa.js
 *
 * Wraps Safaricom Daraja API v2:
 *  - getAccessToken()      → OAuth bearer token
 *  - stkPush()             → Lipa na M-Pesa Online (STK Push)
 *  - generatePassword()    → base64 timestamp password
 *  - verifyCallback()      → validate callback IP (optional whitelist)
 */

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  MPESA_ENV = "sandbox",           // "sandbox" | "production"
} = process.env;

const BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

/* ── 1. Access Token ─────────────────────────────────────── */
export async function getAccessToken() {
  const credentials = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  return data.access_token;
}

/* ── 2. Timestamp & Password ─────────────────────────────── */
export function generateTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

export function generatePassword(timestamp) {
  const raw = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(raw).toString("base64");
}

/* ── 3. STK Push ─────────────────────────────────────────── */
/**
 * @param {object} opts
 * @param {string} opts.phone         - "2547XXXXXXXX" format
 * @param {number} opts.amount        - integer KES
 * @param {string} opts.accountRef    - short reference e.g. booking ID
 * @param {string} opts.description   - max 20 chars
 */
export async function stkPush({ phone, amount, accountRef, description }) {
  const token     = await getAccessToken();
  const timestamp = generateTimestamp();
  const password  = generatePassword(timestamp);

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password:          password,
    Timestamp:         timestamp,
    TransactionType:   "CustomerPayBillOnline",
    Amount:            Math.round(amount),
    PartyA:            phone,
    PartyB:            MPESA_SHORTCODE,
    PhoneNumber:       phone,
    CallBackURL:       MPESA_CALLBACK_URL,
    AccountReference:  accountRef.slice(0, 12),   // Daraja limit
    TransactionDesc:   description.slice(0, 20),
  };

  const { data } = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
  // { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription,
  //   CustomerMessage }
}

/* ── 4. STK Query (poll status) ──────────────────────────── */
export async function stkQuery(checkoutRequestId) {
  const token     = await getAccessToken();
  const timestamp = generateTimestamp();
  const password  = generatePassword(timestamp);

  const { data } = await axios.post(
    `${BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      BusinessShortCode: MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      CheckoutRequestID: checkoutRequestId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

/* ── 5. Safaricom callback IP whitelist (optional) ───────── */
const SAFARICOM_IPS = [
  "196.201.214.200", "196.201.214.206",
  "196.201.213.114", "196.201.214.207",
  "196.201.214.208", "196.201.213.44",
  "196.201.212.127", "196.201.212.138",
  "196.201.212.129", "196.201.212.136",
  "196.201.212.74",  "196.201.212.69",
];

export function isSafaricomIP(ip) {
  if (process.env.NODE_ENV !== "production") return true; // skip in dev
  return SAFARICOM_IPS.includes(ip);
}