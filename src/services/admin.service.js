import Insurance from '../models/insuranceCompany';

export class AdminService {
  static async addInsuranceCompany(input) {
    try {
      const insuranceCompany = await Insurance.findOne({ businessEmail: input.businessEmail });
      if (insuranceCompany) return false;
      return Insurance.create(input);
    } catch (error) {
      return new Error(error);
    }
  }
}
