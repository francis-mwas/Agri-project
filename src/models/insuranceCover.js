import mongoose from 'mongoose';

const { Schema } = mongoose;

const insuranceCoverSchema = new Schema({
  type: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  farmingCategory: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('insuranceCover', insuranceCoverSchema);
