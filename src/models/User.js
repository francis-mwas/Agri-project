import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      sparse: true
    }
  },
  password: {
    type: String,
    minlength: 5,
    required: true
  },
  phone: String,
  alternatePhone: String,
  role: {
    type: String,
    enum: ['farmer', 'insurance-company', 'agro-chemical-company', 'go-organic-company', 'buyer', 'admin'],
    default: 'farmer'
  }
});

export const User = model('User', UserSchema);
