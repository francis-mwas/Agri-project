import { AdminService } from '../services/admin.service';
import { insuranceValidator } from '../validator/admin.validator';
import Insurance from '../models/insuranceCompany';
import Product from '../models/Product';
import { User } from '../models/User';

export class AdminController {
  // register insurance company
  static async registerInsurance(req, res, next) {
    try {
      const input = req.body;
      const cleanInput = await insuranceValidator.validate(input, { abortEarly: false });
      const result = await AdminService.addInsuranceCompany(cleanInput);

      if (!result) return res.status(400).send({ success: false, message: 'Company with email already exists' });
      return res.status(200).send({
        status: true,
        message: 'Insurance company added successfully'
      });
    } catch (err) {
      if (err.errors) {
        return res.status(422).json({ error: err.errors });
      }
      return next(err);
    }
  }

  // get all insurance companies
  static async getAllInsuranceCompanies(req, res, next) {
    try {
      const companies = await Insurance.find({});
      return res.status(200).json({
        status: 'success',
        message: 'Companies returned successfully',
        data: companies
      });
    } catch (error) {
      return next(error);
    }
  }

  // view a single company
  static async getSingleCompany(req, res) {
    let company;
    try {
      company = await Insurance.findById(req.params.id);
    } catch (e) {
      return res.status(404).json({
        status: false,
        Message: 'Wrong id passed, No company found'
      });
    }

    if (!company) {
      return res.status(404).json({
        status: false,
        Message: 'Company with this id not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      Message: 'Company retrieved successfully',
      company
    });
  }

  // delete insurance company
  static async deleteCompany(req, res, next) {
    try {
      const company = await Insurance.findByIdAndDelete(req.params.id);
      if (!company) {
        return res.status(404).json({
          status: false,
          Message: 'Company with this id not found'
        });
      }
      await company.remove();

      return res.status(204).json({
        status: true,
        Message: 'Company deleted successfully'
      });
    } catch (e) {
      return next(e);
    }
  }

  // get all uploaded products
  static async getAllUploadedProducts(req, res, next) {
    try {
      const products = await Product.find({});
      return res.status(200).json({
        status: 'success',
        message: 'Products returned successfully',
        data: products
      });
    } catch (error) {
      return next(error);
    }
  }

  // get a single product
  static async getSingleProduct(req, res) {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (e) {
      return res.status(404).json({
        status: false,
        Message: 'Wrong id passed, No product found'
      });
    }

    if (!product) {
      return res.status(404).json({
        status: false,
        Message: 'Product with this id does not exist'
      });
    }

    return res.status(200).json({
      status: 'success',
      Message: 'Products retrieved successfully',
      product
    });
  }

  // delete a single product
  static async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: false,
          Message: 'Product with this id does not exist'
        });
      }
      await product.remove();

      return res.status(204).json({
        status: true,
        Message: 'Product deleted successfully'
      });
    } catch (e) {
      return next(e);
    }
  }

  // Handle agro-chemicals companies here

  // get all agro chemicals companies
  static async getAllAgroChemicals(req, res, next) {
    try {
      const agroChemicals = await User.find({}).where({ role: 'agro-chemical-company' });
      return res.status(200).json({
        status: 'success',
        message: 'Agro chemicals companies returned successfully',
        data: agroChemicals
      });
    } catch (error) {
      return next(error);
    }
  }

  // view a single agro-chemical company here
  static async getSingleAgroChemical(req, res) {
    let agroChemicalCompany;
    try {
      agroChemicalCompany = await User.findById(req.params.id);
    } catch (e) {
      return res.status(404).json({
        status: false,
        Message: 'Wrong id passed, No agro chemical company found'
      });
    }

    if (!agroChemicalCompany) {
      return res.status(404).json({
        status: false,
        Message: 'agro chemical company with this does not exist'
      });
    }

    return res.status(200).json({
      status: 'success',
      Message: 'Agro chemical company retrieved successfully',
      agroChemicalCompany
    });
  }

  // delete agro chemical company
  static async deleteAgroChemical(req, res, next) {
    try {
      const agroChemicalCompany = await User.findByIdAndDelete(req.params.id);
      if (!agroChemicalCompany) {
        return res.status(404).json({
          status: false,
          Message: 'agro chemical company with this does not exist'
        });
      }
      await agroChemicalCompany.remove();

      return res.status(204).json({
        status: true,
        Message: 'agro chemical company successfully'
      });
    } catch (e) {
      return next(e);
    }
  }

  // manage user acoount
  static async updateUserDetails(req, res) {
    try {
      const user = await User.findById(req.user.user.id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'No user with this id'
        });
      }

      // eslint-disable-next-line max-len
      const updatedUserDetails = await User.findOneAndUpdate({ _id: user.id }, { $set: req.body }, { new: true });
      return res.status(202).json({
        status: true,
        message: 'Update successful',
        updatedUserDetails
      });
    } catch (err) {
      return res.status(404).json({
        status: false,
        message: `An error occurred: ${err}`
      });
    }
  }
}
