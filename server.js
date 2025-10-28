// server.js — ZEON Mint API (كامل ومحدث)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ========== إعداد المسارات ========== //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== إعدادات العملة ========== //
const TOKEN_NAME = "zeon";
const ZEON_PER_BUNDLE = 1250;     // عدد التوكنات لكل باقة
const PRICE_PER_BUNDLE_USD = 1.5; // السعر لكل باقة بالدولار
const CURRENCY = "USDC";          // نوع العملة

// ========== GET / ========== //
app.get("/", (_req, res) => {
  res.send(`
    <html><head><meta charset="utf-8"><title>ZEON Mint API</title></head>
    <body style="font-family:system-ui,sans-serif;text-align:center;margin:4rem">
      <h2>🚀 ZEON Mint API is running!</h2>
      <p>POST <code>/api/mint</code> to mint ZEON tokens.</p>
      <p>Or visit <a href="/mint">/mint</a> for the wallet UI.</p>
    </body></html>
  `);
});

// ========== GET /mint (صفحة واجهة المستخدم) ========== //
app.get("/mint", (req, res) => {
  res.sendFile(path.join(__dirname, "mint-wallet.html"));
});

// ========== GET /api/mint (للعرض في المتصفح و x402scan) ========== //
app.get("/api/mint", (req, res) => {
  res.status(402).json({
    ok: false,
    error: "Payment Required",
    x402Version: 1,               // رقم وليس نص
    p: "x402",
    op: "mint",
    tick: TOKEN_NAME,
    amt: ZEON_PER_BUNDLE,
    price: PRICE_PER_BUNDLE_USD,
    currency: CURRENCY,
    message: `Mint ${ZEON_PER_BUNDLE} ${TOKEN_NAME.toUpperCase()} = $${PRICE_PER_BUNDLE_USD}`,
    info: "Use POST /api/mint with a valid JSON body to mint."
  });
});

// ========== POST /api/mint (السكّ الفعلي) ========== //
app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body || {};

    // تحقق من صحة الطلب
    if (!p && !op && !tick && !id && !amt) {
      return res.status(402).json({
        ok: false,
        error: "Payment Required",
        x402Version: 1,
        p: "x402",
        op: "mint",
        tick: TOKEN_NAME,
        amt: ZEON_PER_BUNDLE,
        price: PRICE_PER_BUNDLE_USD,
        currency: CURRENCY,
        message: `Mint ${ZEON_PER_BUNDLE} ${TOKEN_NAME.toUpperCase()} = $${PRICE_PER_BUNDLE_USD}`,
      });
    }

    // تحقق من القيم
    if (p !== "x402" || op !== "mint" || tick !== TOKEN_NAME || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    // يمكنك لاحقًا إضافة توليد معاملة blockchain هنا إن أردت.
    return res.json({
      ok: true,
      id,
      tick,
      bundles,
      amount,
      pricePerBundleUSD: PRICE_PER_BUNDLE_USD,
      totalPriceUSD: totalPrice,
      currency: CURRENCY,
      message: `Minting ${amount} ${TOKEN_NAME.toUpperCase()} = ${bundles} bundle(s) for $${totalPrice}`,
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
});

// ========== تشغيل السيرفر ========== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ZEON Mint API running on port ${PORT}`);
});
