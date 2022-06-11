/* eslint-disable no-restricted-syntax */
import isEmpty from '../validator/isEmpty';

// make sure fields are not empty before updating
export default class AdminValidator {
  // eslint-disable-next-line consistent-return
  static checkEmptyValues(req, res, next) {
    const values = Object.keys(req.body);
    for (const value of values) {
      if (isEmpty(req.body[value])) {
        return res.status(400).json({ [value]: `${value} field cant be blank` });
      }
    }

    next();
  }
}
