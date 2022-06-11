import Insurance from '../models/insuranceCompany';

/**
 * Validate insurance companies data
 * Make sure insurance name is unique to every business
 * Make sure insurance phone number is unique
 */
export default class InsuranceCompanyValidator {
  // make sure business name is unique
  static uniqueInsuranceName(req, res, next) {
    Insurance.findOne({ companyName: req.body.companyName })
      // eslint-disable-next-line consistent-return
      .then((company) => {
        if (company) {
          return res.status(409).json({
            status: false,
            Message: `Company with name ${req.body.companyName} already exists`
          });
        }
        next();
      })
      .catch(next);
  }

  // make sure phone number is unique
  static uniquePhoneNumber(req, res, next) {
    Insurance.findOne({ pocPhoneNumber: req.body.pocPhoneNumber })
      // eslint-disable-next-line consistent-return
      .then((company) => {
        if (company) {
          return res.status(409).json({
            status: false,
            Message: `Company with phone number ${req.body.pocPhoneNumber} already exists`
          });
        }
        next();
      })
      .catch(next);
  }
}
