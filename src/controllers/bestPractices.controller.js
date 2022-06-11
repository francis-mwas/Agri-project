import BestPractices from '../models/bestPractices';
import { FarmingInformationService } from '../services/farmingInformation.service';
import { organicInformationValidator } from '../validator/organicInformationValidator';

export default class OrganicFarmingBestPractices {
  // create organic farming information
  static async farmingInformation(req, res, next) {
    try {
      const input = req.body;
      const cleanInput = await organicInformationValidator.validate(input, { abortEarly: false });
      const result = await FarmingInformationService.addInformation(cleanInput);

      return res.status(200).send({
        status: true,
        message: 'Organic farming information added successfully',
        result
      });
    } catch (err) {
      if (err.errors) {
        return res.status(422).json({ error: err.errors });
      }
      return next(err);
    }
  }

  // get all farming information from the db
  static async getFarmingInformation(req, res, next) {
    try {
      const information = await BestPractices.find();
      return res.status(200).json({
        status: 'success',
        message: 'Farming information returned successfully',
        data: information
      });
    } catch (error) {
      return next(error);
    }
  }

  // view a piece of information
  static async getSingleInformation(req, res) {
    let information;
    try {
      information = await BestPractices.findById(req.params.id);
    } catch (e) {
      return res.status(404).json({
        status: false,
        Message: 'Wrong id passed, No Information found'
      });
    }

    if (!information) {
      return res.status(404).json({
        status: false,
        Message: 'Information with this id not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      Message: 'Farming information retrieved successfully',
      information
    });
  }

  // delete farming information
  static async deleteFarmingInformation(req, res, next) {
    try {
      const information = await BestPractices.findByIdAndDelete(req.params.id);
      if (!information) {
        return res.status(404).json({
          status: false,
          Message: 'Information with this id not found'
        });
      }
      await information.remove();

      return res.status(204).json({
        status: true,
        Message: 'Farming Information deleted successfully'
      });
    } catch (e) {
      return next(e);
    }
  }
}
