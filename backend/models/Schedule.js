const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examDate: { type: Date, required: true },
  topics: [
    {
      topic: String,
      difficulty: Number,
    },
  ],
  studyPlan: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
