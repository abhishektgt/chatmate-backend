const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticate = require("../middleware/authMiddleware");

// PUT /api/user - update user settings
router.put("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateFields = req.body;

    // Don't allow email or password to be updated this way
    delete updateFields.email;
    delete updateFields.password;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error while updating user." });
  }
});

module.exports = router;
