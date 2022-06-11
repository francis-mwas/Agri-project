/**
 * Perform role based authentication..
 * @param {roles} roles - The function accept user role as a parameter
 * to determine if user * * is authorised to perform a certain action.
 * if user role is not found on the created roles array, the access is denied and
 * error code 403 for unauthorised is returned
 */
// eslint-disable-next-line consistent-return
exports.restrictAccessTo = (...roles) => (req, res, next) => {
  // eslint-disable-next-line spaced-comment
  //roles is an array e.g ['admin', 'farmer']
  if (!roles.includes(req.user.user.role)) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have a permission to perform this action'
    });
  }
  next();
};
