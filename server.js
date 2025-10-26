// Ensure this is ABOVE app.listen(...)
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("🚀 Zeon x402 API"));

// Respond with 402 for BOTH POST and GET so browsers & x402scan both work
app.all("/api/mint", (req, res) => {
  res
    .status(402) // <-- REQUIRED by x402scan
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
          maxAmountRequired: "1500000", // 1.5 USDC in micro units (6 dp)
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://your-domain/pay/usdc",
          mimeType: "application/json",
          description: "Mint 1,250 ZEON for $1.50 USDC on Base",
        },
      ],
      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay to index each mint",
    });
});

// keep your app.listen(...)
