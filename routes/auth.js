const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    userLikes,
    userDislikes,
    userHobbies,
    userGoals,
    companionName,
    companionSkills,
    companionLikes,
    companionDislikes,
    companionTone,
    companionPurpose,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
      userLikes,
      userDislikes,
      userHobbies,
      userGoals,
      companionName,
      companionSkills,
      companionLikes,
      companionDislikes,
      companionTone,
      companionPurpose,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        companionName: newUser.companionName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userLikes: user.userLikes,
        userDislikes: user.userDislikes,
        userHobbies: user.userHobbies,
        userGoals: user.userGoals,
        companionName: user.companionName,
        companionSkills: user.companionSkills,
        companionLikes: user.companionLikes,
        companionDislikes: user.companionDislikes,
        companionTone: user.companionTone,
        companionPurpose: user.companionPurpose,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
