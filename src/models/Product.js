import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productTitle: {
    type: String
  },
  location: {
    type: String
  },
  productQuantity: {
    type: String
  },
  pricePerUnit: {
    type: String
  },
  productDescription: {
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

export default mongoose.model('Products', productSchema);
