// routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const authMiddleware = require("../middleware/authMiddleware");

// GET route - Load all messages for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages." });
  }
});

// DELETE route - Clear all messages for user
router.delete("/", authMiddleware, async (req, res) => {
  try {
    console.log("=== CLEAR HISTORY ROUTE HIT ===");
    console.log("User ID:", req.user.id);
    
    // Delete all messages for the authenticated user
    const result = await Message.deleteMany({ userId: req.user.id });
    
    console.log("Deleted messages count:", result.deletedCount);
    
    res.json({ 
      message: "Chat history cleared successfully",
      deletedCount: result.deletedCount 
    });
    
  } catch (err) {
    console.error("Clear history error:", err);
    res.status(500).json({ 
      error: "Failed to clear chat history", 
      details: err.message 
    });
  }
});

module.exports = router;