import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ZEON_PER_BUNDLE = 1250;
const PRICE_PER_BUNDLE_USD = 1.5;

app.post("/api/mint", async (req, res) => {
  try {
    const { p, op, tick, id, amt } = req.body;
    if (p !== "x402" || op !== "mint" || tick !== "zeon" || !amt) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }

    const amount = Number(amt);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    const bundles = Math.ceil(amount / ZEON_PER_BUNDLE);
    const totalPrice = bundles * PRICE_PER_BUNDLE_USD;

    return res.json({
      ok: true,
      id,
      tick,
      bundles,
      amount,
      pricePerBundleUSD: PRICE_PER_BUNDLE_USD.toFixed(2),
      totalPriceUSD: totalPrice.toFixed(2),
      message: `Minting ${amount} ZEON = ${bundles} bundle(s) for $${totalPrice.toFixed(2)}`
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 ZEON Mint API is running! Use POST /api/mint");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
