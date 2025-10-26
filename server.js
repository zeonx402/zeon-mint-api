// Robust x402 Mint API: always returns 402 on /api/mint (no redirects)
const express = require("express");
const app = express();

app.enable("trust proxy");
app.set("case sensitive routing", true);
app.set("strict routing", true);

app.use(express.json());

// Simple logs to verify requests hit THIS app
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Health (200)
app.get("/", (_req, res) => res.send("🚀 x402 API up"));

// A forced-402 tester to check deployment quickly
app.all("/force402", (_req, res) => {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    })
    .json({ ok: true, note: "force402 works" });
});

// The x402 Mint response body (put your values here)
function mintBody() {
  return {
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
        // MUST be STRING in smallest unit (USDC=6dp): 1.5 -> 1500000
        maxAmountRequired: "1500000",
        maxTimeoutSeconds: 900,
        payTo: "0xF7A5D65840683B2831BDB2B93222057b28D735B4",
        resource: "https://example.com/pay/usdc",
        mimeType: "application/json",
        description: "Mint 1,250 ZEON for $1.50 USDC on Base"
      }
    ],
    payer: "zeonx402",
    status: "ok",
    desc: "Zeon x402 Mint — pay to index each mint"
  };
}

// Return 402 for GET/POST/HEAD and with/without trailing slash
const mintHandler = (_req, res) => {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    })
    .json(mintBody());
};

app.get("/api/mint", mintHandler);
app.post("/api/mint", mintHandler);
app.head("/api/mint", mintHandler);
app.get("/api/mint/", mintHandler);
app.post("/api/mint/", mintHandler);
app.head("/api/mint/", mintHandler);

// Clear 404 for the rest
app.use((_req, res) => res.status(404).send("Not found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API on ${PORT}`));
