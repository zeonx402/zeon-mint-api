// Zeon x402 Mint API
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 Zeon x402 Mint API is live!");
});

app.post("/api/mint", (_req, res) => {
  res.json({
    tick: "zeon",
    p: "x402",
    op: "mint",
    amt: "125",
    fee_usd: "0.15",
    dev_wallet: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
    status: "ok"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zeon API running on port ${PORT}`));
