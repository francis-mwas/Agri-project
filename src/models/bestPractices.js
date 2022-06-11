import mongoose from 'mongoose';

const { Schema } = mongoose;

const bestPracticesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: String,
    required: true
  },
  seeds: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

export default mongoose.model('BestPractices', bestPracticesSchema);
