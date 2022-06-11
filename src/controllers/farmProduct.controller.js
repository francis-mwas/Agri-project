import Products from '../models/Product';

export default class FarmProduct {
  static async getAllFarmProducts(req, res) {
    try {
      const result = await Products.find({}).populate('user', '-password').exec();
      return res.status(200).json({ data: result, success: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors, success: false });
    }
  }

  static async getSingleFarmProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await Products.find({ _id: id }).populate('user', '-password').exec();
      return res.status(200).json({ data: result, success: true });
    } catch (err) {
      return res.status(400).json({ errors: err, success: false });
    }
  }
}
