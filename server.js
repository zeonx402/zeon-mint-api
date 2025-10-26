// Zeon x402 Mint API
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

app.post("/api/mint", (_req, res) => {
  res.status(402).json({
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: "base",
        maxAmountRequired: "1.5", // must be string
        resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
        description: "Mint 1250 Zeon tokens",
        mimeType: "application/json",
        payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
        asset: "USDC",
        maxTimeoutSeconds: 60
      }
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Zeon API running on port ${PORT}`)
