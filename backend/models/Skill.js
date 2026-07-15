const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teachSkill: [{ type: String, required: true }],
    learnSkill: [{ type: String, required: true }],
    experience: { type: String, default: '' }, // e.g. Beginner / Intermediate / Expert
    availability: { type: String, default: '' }, // e.g. Weekdays / Weekends / Evenings
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);