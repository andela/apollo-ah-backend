import jwt from 'jsonwebtoken';
import models from '../models';

const { User } = models;


/**
 * token: <access_token>
 * @constant
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Object} next next object
 *
 * @returns {Object}
 *
 * @exports verifyToken
 */

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'User authorization token is required'
    });
  }

  if (token === undefined || token === null) {
    return res.status(401).json({
      success: false,
      message: 'User authorization token is required'
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Expired user authorization token'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid user authorization token'
    });
  }

  return User.findById(decoded.id)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid user authorization token',
        });
      }
      req.userId = decoded.id;
      req.isAdmin = decoded.isAdmin;
      return next();
    });
};

export default verifyToken;
