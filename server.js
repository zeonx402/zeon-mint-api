// server.js — ZEON Mint API (x402scan auto-discovery + wallet UI)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------- Paths ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Mint Config ----------
const TOKEN_NAME = "zeon";
const ZEON_PER_BUNDLE = 1250;     // number
const PRICE_PER_BUNDLE_USD = 1.5; // number
const CURRENCY = "USDC";          // string

// ---------- Landing ----------
app.get("/", (_req, res) => {
  res.send(`
    <html><head><meta charset="utf-8"><title>ZEON Mint API</title></head>
    <body style="font-family:system-ui,sans-serif;text-align:center;margin:4rem">
      <h2>🚀 ZEON Mint API is running!</h2>
      <p>Try <a href="/api/mint">/api/mint</a> (GET) to see the x402 probe response.</p>
      <p>Use <code>POST /api/mint</code> to mint. Wallet UI at <a href="/mint">/mint</a>.</p>
    </body></html>
  `);
});

// ---------- Serve wallet UI ----------
app.get("/mint", (_req, res) => {
  res.sendFile(path.join(__dirname, "mint-wallet.html"));
});

// ---------- GET /api/mint (x402scan auto-discovery via 402) ----------
app.get("/api/mint", (_req, res) => {
  res.status(402).json({
    ok: false,
    error: "Payment Required",
    x402Version: 1,                 // MUST be a number
    p: "x402",
    op: "mint",
    tick: TOKEN_NAME,
    id: "zeon-{timestamp}-{rand}",  // hint for clients that auto-generate IDs
    amt: ZEON_PER_BUNDLE,
    price: PRICE_PER_BUNDLE_USD,
    currency: CURRENCY,
    // 👇 This schema lets x402scan render a form/CTA automatically
    schema: {
      type: "object",
      required: ["p", "op", "tick", "id", "amt"],
      properties: {
        p:    { const: "x402" },
        op:   { const: "mint" },
        tick: { const: TOKEN_NAME },
        id:   { type: "string", title: "Mint ID",  default: "zeon-{timestamp}-{rand}" },
        amt:  { type: "string", title: "Amount (ZEON)", default: String(ZEON_PER_BUNDLE) }
      }
    },
    message: `Mint ${ZEON_PER_BUNDLE} ${TOKEN_NAME.toUpperCase()} for $${PRICE_PER_BUNDLE_USD} ${CURRENCY}`,
    info: "Send POST /api/mint with a valid JSON body to mint ZEON."
  });
});

// ---------- POST /api/mint (actual mint request handling) ----------
app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body || {};

    // If no body → treat as probe (return 402 again)
    if (!p && !op && !tick && !id && !amt) {
      return res.status(402).json({
        ok: false,
        error: "Payment Required",
        x402Version: 1,
        p: "x402",
        op: "mint",
        tick: TOKEN_NAME,
        id: "zeon-{timestamp}-{rand}",
        amt: ZEON_PER_BUNDLE,
        price: PRICE_PER_BUNDLE_USD,
        currency: CURRENCY
      });
    }

    // Validate
    if (p !== "x402" || op !== "mint" || tick !== TOKEN_NAME || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    // Pricing summary
    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    // TODO (optional): add on-chain tx creation and return { txRequest: { to, data, value } }
    return res.json({
      ok: true,
      id,
      tick,
      bundles,
      amount,
      pricePerBundleUSD: PRICE_PER_BUNDLE_USD,
      totalPriceUSD: totalPrice,
      currency: CURRENCY,
      message: `Minting ${amount} ${TOKEN_NAME.toUpperCase()} = ${bundles} bundle(s) for $${totalPrice}`
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ZEON Mint API running on port ${PORT}`);
});
