// server.js
// 🚀 ZEON Mint API — compatible with x402scan

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== Config =====
const TOKEN_NAME = "zeon";        // اسم التوكن
const ZEON_PER_BUNDLE = 1250;     // عدد ZEON في كل حزمة
const PRICE_PER_BUNDLE_USD = 1.5; // السعر بالدولار لكل حزمة
const CURRENCY = "USDC";          // عملة التسعير

// ===== Mint Endpoint =====
app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body || {};

    // x402scan probe: no body => must return 402 with a typed JSON body
    if (!p && !op && !tick && !id && !amt) {
      return res.status(402).json({
        ok: false,
        error: "Payment Required",
        x402Version: "1.0",
        p: "x402",
        op: "mint",
        tick: TOKEN_NAME,
        amt: ZEON_PER_BUNDLE.toString(),
        price: PRICE_PER_BUNDLE_USD.toString(),
        currency: CURRENCY,
        message: `Mint ${ZEON_PER_BUNDLE} ${TOKEN_NAME.toUpperCase()} = $${PRICE_PER_BUNDLE_USD}`,
        info: "Send a valid JSON body to complete mint operation."
      });
    }

    // Validate client mint body
    if (p !== "x402" || op !== "mint" || tick !== TOKEN_NAME || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    // Pricing
    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    // Success response (you can also add on-chain tx creation later)
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
    <html>
      <head>
        <meta charset="utf-8" />
        <title>ZEON Mint API</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align:center; margin:4rem; }
          code, pre { background:#f4f4f4; padding:.5rem .75rem; border-radius:8px; }
        </style>
      </head>
      <body>
        <h2>🚀 ZEON Mint API is running</h2>
        <p>Use <code>POST /api/mint</code>. Probe without a body returns <b>402</b> for x402scan.</p>
        <p>Example body:</p>
        <pre>{
  "p": "x402",
  "op": "mint",
  "tick": "zeon",
  "id": "zeon-20251028-abc123",
  "amt": "1250"
}</pre>
      </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ZEON Mint API running on port ${PORT}`);
});
