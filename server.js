// Zeon x402 Mint API — fully compliant 402 endpoint
const express = require("express");
const app = express();

app.enable("trust proxy");
app.set("case sensitive routing", true);
app.set("strict routing", true);
app.use(express.json());

// -------- helpers --------
const mintBody = () => ({
  // مهم لـ x402scan
  x402Version: 1,

  // معلومات المنتج/النعناع (اختياري لكنها مفيدة)
  tick: "zeon",
  p: "x402",
  op: "mint",
  amt: "1250",
  fee_usd: "1.5",
  dev_wallet: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",

  // طرق الدفع المقبولة
  accepts: [
    {
      scheme: "exact",
      network: "base",
      asset: "USDC",

      // يجب أن يكون نصًّا وبأصغر وحدة (USDC = 6 منازل).
      // 1.50 USDC  =>  "1500000"
      maxAmountRequired: "1500000",

      maxTimeoutSeconds: 900,
      payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
      resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
      mimeType: "application/json",
      description: "Mint 1,250 ZEON for $1.50 USDC on Base"
    }

    // خيار ETH (اختياري) — بوحدة wei كنص:
    // {
    //   scheme: "exact",
    //   network: "base",
    //   asset: "ETH",
    //   maxAmountRequired: "370000000000000", // ~0.00037 ETH
    //   maxTimeoutSeconds: 900,
    //   payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
    //   resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
    //   mimeType: "application/json",
    //   description: "Mint 1,250 ZEON — pay ETH equivalent on Base"
    // },
  ],

  // معلومات إضافية (اختياري)
  payer: "zeonx402",
  status: "ok",
  desc: "Zeon x402 Mint — pay to index each mint"
});

// -------- routes --------
app.get("/", (_req, res) => res.send("🚀 Zeon x402 API is live"));

// مُختبر سريع للتأكد من 402
app.all("/force402", (_req, res) => {
  res.status(402).set({
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  }).json({ ok: true, note: "force402 works" });
});

// أعد 402 على /api/mint (GET/POST/HEAD) ومع السلاش/بدون
const sendMint402 = (_req, res) => {
  res.status(402).set({
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  }).json(mintBody());
};

app.get("/api/mint", sendMint402);
app.post("/api/mint", sendMint402);
app.head("/api/mint", sendMint402);
app.get("/api/mint/", sendMint402);
app.post("/api/mint/", sendMint402);
app.head("/api/mint/", sendMint402);

// 404 لباقي المسارات
app.use((_req, res) => res.status(404).send("Not found"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
