// Zeon x402 Mint API — guaranteed 402 for /api/mint
const express = require("express");
const app = express();

app.use(express.json());

// --- Basic logging to verify requests hit this app ---
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// --- Health route (200) ---
app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 API is live");
});

// --- Tester route: guaranteed 402 to verify deployment ---
app.all("/force402", (_req, res) => {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    })
    .json({ ok: true, note: "forced 402 works" });
});

// --- Mint route: MUST return 402 for x402scan ---
app.all("/api/mint", (_req, res) => {
  res
    .status(402) // REQUIRED by x402
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    })
    .json({
      x402Version: 1,
      tick: "zeon",
      p: "x402",
      op: "mint",
      amt: "1250",
      fee_usd: "1.5",
      dev_wallet: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
      accepts: [
        {
          scheme: "exact",
          network: "base",
          asset: "USDC",
          // amounts must be strings in the smallest unit
          maxAmountRequired: "1500000", // 1.5 USDC -> 1,500,000 (6 decimals)
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://your-domain.example/pay/usdc",
          mimeType: "application/json",
          description: "Mint 1,250 ZEON for $1.50 USDC on Base",
        },
        // Optional ETH option (uncomment if you want a second option)
        // {
        //   scheme: "exact",
        //   network: "base",
        //   asset: "ETH",
        //   maxAmountRequired: "370000000000000", // ~0.00037 ETH in wei
        //   maxTimeoutSeconds: 900,
        //   payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
        //   resource: "https://your-domain.example/pay/eth",
        //   mimeType: "application/json",
        //   description: "Mint 1,250 ZEON — pay ETH equivalent on Base",
        // },
      ],
      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay to index each mint",
    });
});

// --- Clear 404 for anything else (kept last) ---
app.use("*", (_req, res) => res.status(404).send("Not found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
