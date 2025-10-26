// Zeon x402 Mint API (x402scan compatible)
const express = require("express");
const app = express();

app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

// Main mint endpoint — must return HTTP 402 for x402scan
app.post("/api/mint", (_req, res) => {
  res
    .status(402) // <-- important: x402 requires 402 Payment Required
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
        { method: "USDC", chain: "base", note: "send $1.5 USDC" },
        { method: "ETH", chain: "base", note: "send equivalent in ETH" }
      ],
      payer: "zeonx402",
      status: "ok",
      desc: "Zeon x402 Mint — pay fee to index each mint"
    });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon API running on port ${PORT}`));
