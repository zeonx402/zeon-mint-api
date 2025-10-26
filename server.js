// Zeon x402 Mint API (x402scan schema-compliant)
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

// MUST return HTTP 402 with detailed accepts[] objects
app.post("/api/mint", (_req, res) => {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    })
    .json({
      x402Version: 1,

      // Operation
      tick: "zeon",
      p: "x402",
      op: "mint",
      amt: "1250",

      // Indexing/dev fee
      fee_usd: "1.5",
      dev_wallet: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",

      // Payment options (each object must include the fields below)
      accepts: [
        {
          scheme: "evm",                 // payment scheme
          network: "base",               // chain/network
          asset: {                       // what to pay with
            type: "erc20",
            symbol: "USDC",
            // TODO: set to your USDC contract on Base if you want strict validation
            address: "0x0000000000000000000000000000000000000000",
            decimals: 6
          },
          maxAmountRequired: 1.5,        // amount in unit of 'asset' (USDC has 6 dp)
          maxTimeoutSeconds: 900,        // allow 15 minutes
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4", // receiver
          // a resource/intent URL describing this payment (can be your own docs/endpoint)
          resource: "https://zeon-mint-api-production.up.railway.app/pay/usdc",
          mimeType: "application/json",
          description: "Send $1.5 USDC on Base to index your mint"
        },
        {
          scheme: "evm",
          network: "base",
          asset: {
            type: "native",
            symbol: "ETH"
          },
          // 1.5 USD in ETH (approx) — replace dynamically if you have a price feed
          maxAmountRequired: 0.00037,
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://zeon-mint-api-production.up.railway.app/pay/eth",
          mimeType: "application/json",
          description: "Send the ETH equivalent of $1.5 on Base"
        }
      ],

      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay fee to index each mint"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon API running on port ${PORT}`));
