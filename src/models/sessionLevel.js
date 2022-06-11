import mongoose from 'mongoose';

const sessionLevelSchema = new mongoose.Schema({
  sessionId: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  level: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SessionLevel', sessionLevelSchema);
