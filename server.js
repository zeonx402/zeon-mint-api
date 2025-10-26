// Zeon x402 Mint API — two paid endpoints with strict 402 responses
const express = require("express");
const app = express();

app.enable("trust proxy");
app.set("case sensitive routing", true);
app.set("strict routing", true);
app.use(express.json());

// ---------- helpers ----------
function mkAcceptUSDC({ usd, usdcMinor, payTo, resource, desc }) {
  return {
    scheme: "exact",
    network: "base",
    asset: "USDC",
    // IMPORTANT: string in the smallest unit (USDC = 6 decimals)
    maxAmountRequired: String(usdcMinor),
    maxTimeoutSeconds: 900,
    payTo,
    resource,
    mimeType: "application/json",
    description: desc,
  };
}

function mkMintBody({ amt, feeUsd, dev, accepts, extraDesc }) {
  return {
    x402Version: 1,
    tick: "zeon",
    p: "x402",
    op: "mint",
    amt: String(amt),          // e.g., "1250"
    fee_usd: String(feeUsd),   // e.g., "1.5"
    dev_wallet: dev,
    accepts,
    payer: "zeonx402",
    status: "ok",
    desc: extraDesc || "Zeon x402 Mint — pay to index each mint",
  };
}

function send402(res, body) {
  res
    .status(402)
    .set({
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    })
    .json(body);
}

// ---------- config ----------
const DEV_WALLET = "0xF7A5D65840683B2831BDB2B93222057b28D735B4";
const BASE_URL   = "https://zeon-mint-api-production.up.railway.app"; // عدّل إذا تغيّر الدومين

// ---------- routes ----------
app.get("/", (_req, res) => res.send("🚀 Zeon x402 API is live"));

// quick tester: should return 402
app.all("/force402", (_req, res) =>
  send402(res, { ok: true, note: "force402 works" })
);

// ---------- 1) /api/mint  ($1.50) ----------
function mintHandler(_req, res) {
  const accepts = [
    mkAcceptUSDC({
      usd: 1.5,
      usdcMinor: 1500000, // 1.50 * 10^6
      payTo: DEV_WALLET,
      resource: `${BASE_URL}/api/mint`,
      desc: "Mint 1,250 ZEON for $1.50 USDC on Base",
    }),
    // (اختياري) مثال ETH بالـ wei كسلسلة:
    // {
    //   scheme: "exact",
    //   network: "base",
    //   asset: "ETH",
    //   maxAmountRequired: "370000000000000", // ~0.00037 ETH
    //   maxTimeoutSeconds: 900,
    //   payTo: DEV_WALLET,
    //   resource: `${BASE_URL}/api/mint`,
    //   mimeType: "application/json",
    //   description: "Mint 1,250 ZEON — pay ETH equivalent on Base",
    // },
  ];

  const body = mkMintBody({
    amt: 1250,
    feeUsd: 1.5,
    dev: DEV_WALLET,
    accepts,
  });

  send402(res, body);
}

// map GET/POST/HEAD + with/without trailing slash
app.get("/api/mint", mintHandler);
app.post("/api/mint", mintHandler);
app.head("/api/mint", mintHandler);
app.get("/api/mint/", mintHandler);
app.post("/api/mint/", mintHandler);
app.head("/api/mint/", mintHandler);

// ---------- 2) /api/mint/custom  ($0.15) ----------
function mintCustomHandler(_req, res) {
  const accepts = [
    mkAcceptUSDC({
      usd: 0.15,
      usdcMinor: 150000, // 0.15 * 10^6
      payTo: DEV_WALLET,
      resource: `${BASE_URL}/api/mint/custom`,
      desc: "Mint 1,250 ZEON for $0.15 USDC on Base",
    }),
  ];

  const body = mkMintBody({
    amt: 1250,
    feeUsd: 0.15,
    dev: DEV_WALLET,
    accepts,
    extraDesc: "Zeon x402 Mint (custom tier) — pay per mint",
  });

  send402(res, body);
}

app.get("/api/mint/custom", mintCustomHandler);
app.post("/api/mint/custom", mintCustomHandler);
app.head("/api/mint/custom", mintCustomHandler);
app.get("/api/mint/custom/", mintCustomHandler);
app.post("/api/mint/custom/", mintCustomHandler);
app.head("/api/mint/custom/", mintCustomHandler);

// fallback
app.use((_req, res) => res.status(404).send("Not found"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
