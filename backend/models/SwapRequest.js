const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    meetLink: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SwapRequest', swapRequestSchema);