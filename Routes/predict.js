const express = require("express");
const router = express.Router();
const axios = require("axios");

// Replace with your Render ML API URL
const ML_API_BASE = "https://walmart-ml.onrender.com";

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const response = await axios.get(`${ML_API_BASE}/predict/${productId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ML prediction" });
  }
});

module.exports = router;