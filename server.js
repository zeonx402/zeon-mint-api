// Zeon x402 Mint API — returns x402 402 response
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("🚀 Zeon x402 Mint API is live!"));

// The Mint endpoint
app.post("/api/mint", (_req, res) => {
  res
    .status(402) // important for x402 to detect the payment request
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
          maxAmountRequired: "1500000", // 1.5 USDC (6 decimals)
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
          mimeType: "application/json",
          description: "Mint 1,250 ZEON for $1.50 USDC on Base",
        },
      ],
      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay to index each mint",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon Mint API running on port ${PORT}`));
