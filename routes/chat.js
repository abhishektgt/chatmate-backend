const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/message");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat (protected)
router.post("/", authMiddleware, async (req, res) => {
  console.log("=== CHAT ROUTE HIT ===");
  console.log("Request body:", req.body);
  console.log("User from auth:", req.user);
  process.stdout.write("🚀 ROUTE DEFINITELY HIT\n");
  console.error("🔴 THIS SHOULD SHOW UP");

  const { prompt, input } = req.body;

  if (!prompt || !input) {
    console.log("Missing prompt or input");
    return res.status(400).json({ error: "Prompt and input are required" });
  }

  try {
    // Save user message to MongoDB
      console.log("Saving message...");
      const userMessage = await Message.create({
        userId: req.user.id,
        sender: "user",
        text: input,
      });
      console.log("Saved user message:", userMessage);

    // Get Gemini reply
    console.log("Calling Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();
    console.log("Got Gemini reply:", botReply);

    // Save Gemini reply to MongoDB
    console.log("Saving bot reply...");
    await Message.create({
      userId: req.user.id,
      sender: "bot",
      text: botReply,
    });
    console.log("Bot reply saved successfully");

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini request failed", details: err.message });
  }
});




module.exports = router;
