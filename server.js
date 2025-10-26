// Zeon x402 Mint API (x402scan strict schema compliant)
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

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
          scheme: "exact",
          network: "base",
          asset: "USDC",
          // 1.5 USDC in smallest unit (6 decimals) => 1_500_000
          maxAmountRequired: "1500000",
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://zeon-mint-api-production.up.railway.app/pay/usdc",
          mimeType: "application/json",
          description: "Send $1.5 USDC (1,500,000 microUSDC) on Base to index your mint"
        },
        {
          scheme: "exact",
          network: "base",
          asset: "ETH",
          // ≈0.00037 ETH in wei (18 decimals) => 370_000_000_000_000
          maxAmountRequired: "370000000000000",
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://zeon-mint-api-production.up.railway.app/pay/eth",
          mimeType: "application/json",
          description: "Send ETH equivalent (~0.00037 ETH = 370,000,000,000,000 wei) on Base"
        }
      ],

      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay fee to index each mint"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon API running on port ${PORT}`));
