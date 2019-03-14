import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import models from '../models';
import { env, generateToken } from '../helpers/utils';
import Mail from '../helpers/sendMail';
import Response from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';
import logger from '../helpers/logger';


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
      const confrimLink = `${env('API_DOMAIN')}/api/v1/users/confirm_account?token=${confirmToken}`;
      // send the user a mail
      const data = {
        email: user.email,
        subject: 'Account confirmation',
        mailContext: {
          link: confrimLink
        },
        template: 'signup'
      };
      user.firstname = '';
      user.lastname = '';
      user.gender = '';
      user.bio = '';
      user.username = request.body.username.toLowerCase();
      user.userId = user.id;
      await models.Profile.create(user);
      // create a user default settings
      await models.Setting.create({ userId: user.userId });
      Response.send(response, STATUS.CREATED, { token, id: user.id });
      await Mail.sendMail(data);
      return;
    } catch (error) {
      return next(error);
    }
  }

  /**
 * Creates an email reset link and sends to the user
 *
 * @static
 * @param {object} request The express request object
 * @param {object} response The express response object
 * @param {function} next The express next function
 * @returns {void}
 * @memberof UsersController
 */
  static async sendPasswordRecoveryLink(request, response, next) {
    try {
      const { email } = request.body;
      const token = jwt.sign({ email }, env('APP_KEY'), { expiresIn: '1h' });
      const link = `${env('API_DOMAIN')}/users/reset_password?token=${token}`;
      const data = {
        email,
        subject: 'Reset your Password',
        mailContext: {
          link
        },
        template: 'password'
      };
      Response.send(response, STATUS.OK, [], MESSAGE.PASSWORD_REQUEST_SUCCESSFUL);
      await Mail.sendMail(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
 * Get a user where the column(param) equals the specified value
 *
 * @static
 * @param {string} param The column to search against (e.g email, id, username)
 * @param {*} value The actual value to test for
 * @returns {object} The user object
 * @memberof UsersController
 */
  static async getUser(param, value) {
    let user;
    try {
      user = await User.findOne({ where: { [param]: value } });
    } catch (error) {
      logger.log(error);
    }
    return user;
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
      if (err || !decoded) return next(createError(401, 'This link is invalid'));
      request.email = decoded.email;
    });
    // get the user with the token mail from DB
    const user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      return Response.send(response, STATUS.NOT_FOUND, null, 'The confirm link is wrong, account not found', false);
    }
    // confirm a user account
    const updateData = await User.update(
      { isConfirmed: true }, { where: { email: request.email } }
    );
    if (!updateData) {
      return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occurred while updating your account', false);
    }
    return Response.send(response, STATUS.OK, null, MESSAGE.ACCOUNT_CONFIRM);
  }
}

export default UsersController;
