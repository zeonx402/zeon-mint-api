const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/mint", (_req, res) => {
  res
    .status(402)
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
          // STRING in smallest unit (USDC = 6 decimals)
          maxAmountRequired: "1500000", // $1.50
          maxTimeoutSeconds: 900,
          payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
          resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
          mimeType: "application/json",
          description: "Mint 1,250 ZEON for $1.50 USDC on Base"
        },

        // (اختياري) خيار ETH بوحدة wei:
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
      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay to index each mint"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API on ${PORT}`));
