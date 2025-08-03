const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Basic user info
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // User Preferences
  userLikes: { type: String },
  userDislikes: { type: String },
  userHobbies: { type: String },
  userGoals: { type: String },

  // Companion Config
  companionName: { type: String },
  companionSkills: { type: String },
  companionLikes: { type: String },
  companionDislikes: { type: String },
  companionTone: { type: String },
  companionPurpose: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
