const express = require("express");
const app = express();

app.use(express.json());

// جسم الاستجابة 402
const mintBody = {
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
      maxAmountRequired: "1.5", // لاحظ أنه نص وليس رقم
      maxTimeoutSeconds: 900,
      payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
      resource: "https://zeon-mint-api-production.up.railway.app/api/mint",
      mimeType: "application/json",
      description: "Mint 1,250 ZEON for $1.50 USDC"
    }
  ],
  payer: "zeonx402",
  status: "ok"
};

// هنا النقطة الأهم — نعيد 402 فعلاً
app.post("/api/mint", (_req, res) => {
  console.log("✅ 402 response sent to /api/mint");
  res.status(402).json(mintBody);
});

app.get("/", (_req, res) => res.send("🚀 Zeon Mint API is live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
