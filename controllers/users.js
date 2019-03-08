import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import models from '../models';
import { env, generateToken } from '../helpers/utils';
import sendMail from '../helpers/sendMail';

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
      // generate confirm token
      const confirmToken = await generateToken({ email: user.email });
      // generate confirm link
      const confrimLink = `${env('API_DOMAIN')}confirm_account/${confirmToken}`;
      // send the user a mail
      const data = {
        email: user.email,
        subject: 'Account confirmation',
        mailContext: {
          link: confrimLink
        },
        template: 'signup'
      };
      await sendMail(data);
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
      if (user && !User.comparePassword(user, password)) {
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

  /**
   * This function confirms a user
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {function} next - Express next function
   * @returns {void}
   */
  static async confirmUser(request, response, next) {
    // get token from the request url
    const emailToken = request.query.token;
    // get email from token
    jwt.verify(emailToken, env('APP_KEY'), (err, decoded) => {
      if (err || !decoded) return next(createError(401, ' Invalid url.'));
      request.email = decoded.email;
    });
    // get the user with the token mail from DB
    const user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      return response.status(404).json({ status: 404, message: 'This link is wrong' });
    }
    // confirm a user account
    const updateData = await User.update({ isConfirmed: true },
      { where: { email: request.email } });
    if (!updateData) {
      return response.status(404).json({ status: 404, message: 'An error occured' });
    }
    return response.status(200).json({ status: 200, message: 'Your account has been confirmed' });
  }
}

export default UsersController;
