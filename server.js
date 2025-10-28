// server.js — ZEON Mint API (x402scan-ready)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== Config =====
const TOKEN_NAME = "zeon";
const ZEON_PER_BUNDLE = 1250;     // number
const PRICE_PER_BUNDLE_USD = 1.5; // number
const CURRENCY = "USDC";          // string

// ===== Mint Endpoint =====
app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body || {};

    // Probe from x402scan: no body -> must return HTTP 402 with a strictly typed JSON
    if (!p && !op && !tick && !id && !amt) {
      return res.status(402).json({
        ok: false,                   // boolean
        error: "Payment Required",   // string
        x402Version: 1,              // ✅ number (NOT string)
        p: "x402",                   // string
        op: "mint",                  // string
        tick: TOKEN_NAME,            // string
        amt: ZEON_PER_BUNDLE,        // ✅ number
        price: PRICE_PER_BUNDLE_USD, // ✅ number
        currency: CURRENCY,          // string
        message: `Mint ${ZEON_PER_BUNDLE} ${TOKEN_NAME.toUpperCase()} = $${PRICE_PER_BUNDLE_USD}`,
        info: "Send a valid JSON body to complete mint operation."
      });
    }

    // Validate client body
    if (p !== "x402" || op !== "mint" || tick !== TOKEN_NAME || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    return res.json({
      ok: true,
      id,
      tick,
      bundles,
      amount,
      pricePerBundleUSD: PRICE_PER_BUNDLE_USD.toFixed(2),
      totalPriceUSD: totalPrice.toFixed(2),
      currency: CURRENCY,
      message: `Minting ${amount} ${TOKEN_NAME.toUpperCase()} = ${bundles} bundle(s) for $${totalPrice.toFixed(2)}`
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
});

// Simple landing page
app.get("/", (_req, res) => {
  res.send(`
    <html><head><meta charset="utf-8"><title>ZEON Mint API</title></head>
    <body style="font-family:system-ui,sans-serif;text-align:center;margin:4rem">
      <h2>🚀 ZEON Mint API is running</h2>
      <p>POST <code>/api/mint</code>. Empty body returns <b>402</b> for x402scan.</p>
      <pre>{
  "p": "x402",
  "op": "mint",
  "tick": "zeon",
  "id": "zeon-20251028-abc123",
  "amt": "1250"
}</pre>
    </body></html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ ZEON Mint API running on port ${PORT}`));
