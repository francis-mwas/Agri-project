import { FarmInput } from '../models/FarmInput';
import { farmInputValidator } from '../validator/farmInputValidator';

export default class FarmInputController {
  static async postInput(req, res) {
    try {
      const { user } = req.user;
      const validInput = await farmInputValidator.validate(req.body, { abortEarly: false });
      const farmInput = new FarmInput({ user: user.id, ...validInput });
      await farmInput.save();
      return res.status(200).json({ farmInput, success: true });
    } catch (error) {
      return res.status(400).json({ errors: error.errors, success: false });
    }
  }

  static async updateFarmInput(req, res) {
    try {
      const {
        user: { id }
      } = req.user;
      const validInput = await farmInputValidator.validate(req.body, { abortEarly: false });
      const farmInputId = req.params.id;
      const farmInput = await FarmInput.findOne({ _id: farmInputId });
      if (!farmInput) return res.status(400).json({ msg: 'product not found', success: false });

      if (id.toString() !== farmInput.user.toString()) return res.status(401).send({ msg: 'you are not authorized' });

      const { name, price, description } = validInput;
      const { imageUrl, quantity } = validInput;
      farmInput.name = name;
      farmInput.price = price;
      farmInput.description = description;
      farmInput.imageUrl = imageUrl;
      farmInput.quantity = quantity;
      const result = await farmInput.save();
      return res.status(200).json({ result, success: true });
    } catch (err) {
      return res.status(400).send({ success: false });
    }
  }

  static async getAllFarmInputs(req, res) {
    try {
      const result = await FarmInput.find({}).populate('user', '-password').exec();
      return res.status(200).json({ data: result, success: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors, success: false });
    }
  }

  static async getSingleFarmInput(req, res) {
    try {
      const { id } = req.params;
      const result = await FarmInput.find({ _id: id }).populate('user', '-password').exec();
      return res.status(200).json({ data: result, success: true });
    } catch (err) {
      return res.status(400).json({ errors: err, success: false });
    }
  }
}
