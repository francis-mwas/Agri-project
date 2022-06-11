import mongoose from 'mongoose';

const { Schema } = mongoose;

const farmInputSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  farmInputName: {
    type: String
  },
  quantity: {
    type: String
  },
  purpose: {
    type: String
  },
  description: {
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

export default mongoose.model('FarmInputs', farmInputSchema);
