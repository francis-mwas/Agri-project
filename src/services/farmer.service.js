import { hash } from 'bcrypt';
import { User } from '../models/User';

export class FarmerService {
  static async add(input) {
    try {
      const passPromise = hash(input.password, 10);
      const findUserPromise = this.findByEmail(input.email);
      const [password, user] = await Promise.all([passPromise, findUserPromise]);
      input.password = password;
      if (user) return false;
      return User.create(input);
    } catch (error) {
      return new Error(error);
    }
  }

  static async findByEmail(email) {
    const user = User.findOne({ email });
    return user;
  }
}
