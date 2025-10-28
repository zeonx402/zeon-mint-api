// server.js
// 🚀 ZEON Mint API - جاهز لـ x402scan

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// إعدادات النعناع
const TOKEN_NAME = "zeon";               // اسم العملة
const ZEON_PER_BUNDLE = 1250;            // كمية التوكن في الحزمة الواحدة
const PRICE_PER_BUNDLE_USD = 1.5;        // السعر بالدولار للحزمة
const CURRENCY = "USDC";                 // العملة المستخدمة للسعر

// ✅ نقطة النهاية الرئيسية للسكّ
app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body || {};

    // 🎯 إذا لم يُرسل body (فحص من x402scan)
    if (!p && !op && !tick && !id && !amt) {
      return res.status(402).json({
        ok: false,
        error: "Payment Required",
        p: "x402",
        op: "mint",
        tick: TOKEN_NAME,
        amt: ZEON_PER_BUNDLE.toString(),
        price: PRICE_PER_BUNDLE_USD.toString(),
        currency: CURRENCY,
        note: "Send valid JSON body to mint ZEON tokens"
      });
    }

    // 🧩 تحقق من صحة JSON المُرسل
    if (p !== "x402" || op !== "mint" || tick !== TOKEN_NAME || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    // 💰 حساب السعر الكلي وعدد الحزم
    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    // ✅ ردّ السكّ الناجح
    return res.json({
      ok: true,
      id,
      tick,
      bundles,
      amount,
      pricePerBundleUSD: PRICE_PER_BUNDLE_USD.toFixed(2),
      totalPriceUSD: totalPrice.toFixed(2),
      currency: CURRENCY,
      message: `Minting ${amount} ZEON = ${bundles} bundle(s) for $${totalPrice.toFixed(2)}`
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🌐 صفحة بسيطة لتأكيد أن الخادم شغال
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>ZEON Mint API</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 5rem; }
          code { background: #f4f4f4; padding: 5px 8px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <h2>🚀 ZEON Mint API is running</h2>
        <p>Use <code>POST /api/mint</code> to mint tokens.</p>
        <p>Example JSON:</p>
        <pre>{
  "p": "x402",
  "op": "mint",
  "tick": "zeon",
  "id": "zeon-20251028-a94f31b8",
  "amt": "1250"
}</pre>
      </body>
    </html>
  `);
});

// 🚀 تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ZEON Mint API running on port ${PORT}`);
});
