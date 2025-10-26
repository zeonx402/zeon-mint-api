// Zeon x402 Mint API (x402scan strict schema compliant)
const express = require("express");
const app = express();

app.use(express.json());

// Root
app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

// Mint endpoint
app.post("/api/mint", (_req, res) => {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
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
          scheme: "exact",                     // ✅ must be "exact"
          network: "base",                     // chain/network
          resource: "https://zeon-mint-api-production.up.railway.app/pay/usdc",
          description: "Send $1.5 USDC on Base to index your mint",
          mimeType: "application/json",
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          maxAmountRequired: "1.5",            // ✅ string, not number
          maxTimeoutSeconds: 900,
          asset: "USDC"                        // ✅ just a string
        },
        {
          scheme: "exact",
          network: "base",
          resource: "https://zeon-mint-api-production.up.railway.app/pay/eth",
          description: "Send the ETH equivalent of $1.5 on Base",
          mimeType: "application/json",
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          maxAmountRequired: "0.00037",
          maxTimeoutSeconds: 900,
          asset: "ETH"
        }
      ],

      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay fee to index each mint"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon API running on port ${PORT}`));
