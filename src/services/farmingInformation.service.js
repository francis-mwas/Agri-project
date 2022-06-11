import BestPractices from '../models/bestPractices';

export class FarmingInformationService {
  static async addInformation(input) {
    try {
      return BestPractices.create(input);
    } catch (error) {
      return new Error(error);
    }
  }
}
