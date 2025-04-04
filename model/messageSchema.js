const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageId_sender: {
    type: String,
  },
  messageId_receiver: {
    type: String,
  },
  content: {
    type: String,
    required: true
  },
  // Timestamp can be automatically handled by Mongoose if you use timestamps in schema options
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
