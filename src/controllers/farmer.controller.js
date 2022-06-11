import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { User } from '../models/User';
import UssdUsers from '../models/ussdUserModel';
import { FarmerValidator, validateSignIn } from '../validator/farmer.validator';
import { FarmerService } from '../services/farmer.service';

export class FarmerController {
  static async register(req, res, next) {
    try {
      const input = req.body;

      const cleanInput = await FarmerValidator.validate(input, { abortEarly: false });

      const result = await FarmerService.add(cleanInput);
      if (!result) return res.status(400).send({ status: false, message: 'user with email already exists' });
      return res.status(200).send({
        success: !!result
      });
    } catch (error) {
      if (error.errors) {
        return res.status(422).send({ error: error.errors });
      }
      return next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const result = await User.find({});
      return res.status(200).send({ data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async signIn(req, res) {
    try {
      const validInput = await validateSignIn.validate(req.body, { abortEarly: false });
      const { email, password } = validInput;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: [{ msg: 'Invalid credentials' }], success: false });
      }
      const isMatch = compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: 'Invalid credentials' }], success: false });
      }
      // capture user role in user payload when user is logging in
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      const token = await jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 360000 });
      return res.status(200).json({
        token: `Bearer ${token}`,
        success: true
      });
    } catch (err) {
      return res.status(400).json({ errors: err.errors, success: false });
    }
  }

  // get all farmers
  static async getAllFarmers(req, res, next) {
    try {
      const farmers = await UssdUsers.find({}).where({ role: 'farmer' });
      return res.status(200).json({ data: farmers });
    } catch (error) {
      return next(error);
    }
  }

  // view a single farmer
  static async getSingleFarmer(req, res) {
    let farmer;
    try {
      farmer = await UssdUsers.findById(req.params.id);
    } catch (e) {
      return res.status(404).json({
        status: false,
        Message: 'Wrong id passed, No farmer found'
      });
    }

    if (!farmer) {
      return res.status(404).json({
        status: false,
        Message: 'Farmer with this id not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      Message: 'Farmer retrieved successfully',
      farmer
    });
  }

  // delete a farmer
  static async deleteFarmer(req, res, next) {
    try {
      const farmer = await UssdUsers.findByIdAndDelete(req.params.id);
      if (!farmer) {
        return res.status(404).json({
          status: false,
          Message: 'A farmer with this id does not exist'
        });
      }
      await farmer.remove();

      return res.status(204).json({
        status: true,
        Message: 'A farmer deleted successfully'
      });
    } catch (e) {
      return next(e);
    }
  }
}
