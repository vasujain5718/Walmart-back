const express = require("express");
const router = express.Router();
const axios = require("axios");

// Replace with your Render ML API URL
const ML_API_BASE = "https://walmart-ml.onrender.com";

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const response=await fetch(`${ML_API_BASE}/predict/${productId}`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ML prediction" });
  }
});

module.exports = router;