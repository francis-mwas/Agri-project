import mongoose from 'mongoose';

const insuranceCompanySchema = new mongoose.Schema({
  companyName: {
    type: String
  },
  businessEmail: {
    type: String
  },
  pocPhoneNumber: {
    type: String
  },
  pocFullname: {
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

export default mongoose.model('insuranceCompany', insuranceCompanySchema);
