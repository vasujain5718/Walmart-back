const express = require("express");
const router = express.Router();
const axios = require("axios");

// ML service base URL hosted on Render
const ML_API_BASE = "https://walmart-ml.onrender.com";

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Step 1: Wake up the ML server by pinging root
    await axios.get(`${ML_API_BASE}/`);

    // Step 2: Optional delay to give server time to fully boot
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec wait

    // Step 3: Now call the actual prediction endpoint
    const response = await axios.get(`${ML_API_BASE}/predict/${productId}`);

    // Step 4: Return the response to frontend
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching ML prediction:", err.message);
    res.status(500).json({ error: "Error fetching ML prediction" });
  }
});

module.exports = router;
