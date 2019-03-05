import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import models from '../models';
import { generateToken } from '../helpers/utils';

const { User } = models;

/**
 * Class representing users controller
 *
 * @class UsersController
 */
class UsersController {
  /**
   * Creates a new user resource
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof UsersController
   */
  static async register(request, response, next) {
    const { body } = request;

    try {
      const user = await User.create(body);
      const token = await generateToken({ user });

      return response
        .status(201)
        .json({ token, id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Authenticate a user
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof UsersController
   */
  static async login(request, response, next) {
    const { body: { email, password } } = request;

    try {
      const user = await User.findOne({ where: { email } });

      // validate user password
      if (user && !bcrypt.compareSync(password, user.password)) {
        throw createError(401, 'Invalid credentials');
      }

      // generate token from user payload
      const payload = JSON.stringify(user.dataValues);
      const token = await generateToken(payload);

      // respond with token
      return response
        .status(200)
        .json({ token, id: user.id });
    } catch (error) {
      return next(error);
    }
  }
}

export default UsersController;
