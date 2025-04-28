const express = require("express");
const jwt = require("jsonwebtoken");
const Schedule = require("../models/Schedule");
const User = require("../models/user");

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Create new schedule
router.post("/", protect, async (req, res) => {
  const { examDate, topics } = req.body;

  try {
    const studyPlan = topics.map((topic) => `${topic.topic}: Study for ${topic.difficulty} days`); // You can customize this logic

    const newSchedule = new Schedule({ userId: req.user._id, examDate, topics, studyPlan });
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// View all schedules of a user
router.get("/", protect, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id }).populate("userId", "username email");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update schedule (optional)
router.put("/:id", protect, async (req, res) => {
  const { examDate, topics } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.examDate = examDate || schedule.examDate;
    schedule.topics = topics || schedule.topics;

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
