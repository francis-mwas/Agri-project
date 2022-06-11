import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  role: {
    type: String,
    default: 'farmer',
    enum: ['farmer', 'insurance-company', 'agro-chemical-company', 'go-organic-company', 'buyer']
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  idNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Users', usersSchema);
