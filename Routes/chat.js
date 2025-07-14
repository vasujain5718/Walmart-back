const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // ✅ adjust path if your .env is not in the same dir

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


let chatSession = null;

router.post('/', async (req, res) => {
  const { prompt, context } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (!chatSession) {
      chatSession = model.startChat({
        history: context ? [
          {
            role: "user",
            parts: [{ text: context }]
          },
          {
            role: "model",
            parts: [{ text: "Acknowledged. Ready for queries." }]
          }
        ] : []
      });
    }

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini is temporarily unavailable." });
  }
});



module.exports = router; // ✅ CommonJS export
