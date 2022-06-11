import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Check token
// eslint-disable-next-line consistent-return
export default (req, res, next) => {
  // Get token from req.headers,authorization
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({
      status: false,
      error: 'Unauthorised request'
    });
  }

  // If there is no token, then the requst is unauthorised\
  if (!token) {
    return res.status(401).json({
      status: false,
      error: 'Unauthorised request'
    });
  }

  // Decode the token
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    // Show an error if any when trying to decode the token
    if (err) {
      return res.status(403).json({
        status: false,
        error: `token expired, login again: ${err}`
      });
    }
    // If the token was successfully decoded, assign the payload to req.user
    req.user = decoded;
    next();
  });
};
