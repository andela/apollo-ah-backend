import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import models from '../models';
import { env, generateToken } from '../helpers/utils';
import Response from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';
import logger from '../helpers/logger';
import NotificationsController from './notificationsController';

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
      const role = await models.Role.findOne({ where: { name: 'user' } });
      await user.setRole(role);
      // generate confirm token
      const confirmationToken = await generateToken({ email: user.email });
      // generate confirm link
      const confirmationLink = `${env('CONFIRM_ACCOUNT')}?token=${confirmationToken}`;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'authorshavenng@gmail.com',
        subject: 'Account confirmation',
        html: `<div class="inner">
        <div class="top">
          <h2>Authors Haven</h2>
          <h1>Confirm Account!</h1>
          <p class="smaller">Hello,</p>
          <p>Thank you for signing up, you can confirm your account with the link below.</p>
          <div class="btn-wrapper">
            <a href="${confirmationLink}">Confirm Account</a>
          </div>
        </div>
      </div>`,
      };
      user.firstname = '';
      user.lastname = '';
      user.bio = '';
      user.image = `${env('API_DOMAIN')}/avatar.png`;
      user.username = request.body.username.toLowerCase();
      user.userId = user.id;
      const { dataValues } = await models.Profile.create(user, { raw: false });
      // create a user default settings
      await models.Setting.create({ userId: user.userId });
      // generate a user token
      dataValues.id = user.id;
      const token = await generateToken({ user: dataValues });
      Response.send(response, STATUS.CREATED, { token, id: user.id });
      await sgMail.send(msg);
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
      const link = `${env('RESET_PASSWORD')}/reset-password?token=${token}`;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: 'authorshavenng@gmail.com',
        subject: 'Reset your Password',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<div class="inner">
        <div class="top">
          <h2>Authors Haven</h2>
          <h1>Reset your password</h1>
          <p class="smaller">Hello,</p>
          <p class="smaller">We received a request to reset your password.</p>
          <p>If you didn’t make this request, simply ignore this message. Otherwise, you can reset your password using this
            link.</p>
          <div class="btn-wrapper">
            <a class="btn" href=${link}>Reset your password</a>
          </div>
          <p class="wrn">* Please note that this link will expire in 1 hour.</p>
        </div>
      </div>`,
      };
      await sgMail.send(msg);
      Response.send(response, STATUS.OK, [], MESSAGE.PASSWORD_REQUEST_SUCCESSFUL);
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
 * @param {string} value The actual value to test for
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
 * Updates the password of a user.
 *
 * @static
 * @param {object} request The express request object
 * @param {object} response The express response object
 * @param {function} next The express next function
 * @returns {void}
 * @memberof UsersController
 */
  static async resetPassword(request, response, next) {
    try {
      const count = await User.update(
        {
          password: request.body.password
        },
        {
          where: { email: request.body.email }
        }
      );
      const success = count > 0;
      return Response.send(
        response, success ? STATUS.OK : STATUS.FORBIDDEN,
        [], success ? MESSAGE.PASSWORD_RESET_SUCCESSFUL : MESSAGE.PASSWORD_LINK_EXPIRED,
        success,
      );
    } catch (error) {
      next(error);
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
      const user = await User.findOne({
        where: { email },
        raw: true,
        include: [{
          model: models.Profile,
        }]
      });
      // validate user password
      if (!user || (user && !User.comparePassword(user, password))) {
        return Response.send(
          response,
          STATUS.UNATHORIZED,
          [],
          MESSAGE.INVALID_CREDENTIALS,
          false
        );
      }
      // generate token from user payload
      const token = await generateToken(user);
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

  /**
   * This function sends a user test notififcation
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {function} next - Express next function
   * @returns {void}
   */
  static async sendUsersTestNotification(request, response) {
    // get all users on the platform
    const userData = await User.findAll({ attributes: ['id'] });
    const userIdsArray = [];
    userData.forEach((data) => {
      const { dataValues } = data;
      const userIds = dataValues;
      userIdsArray.push(userIds.id);
    });
    const res = await NotificationsController.create('Hello welcome to AH.', userIdsArray);
    return res;
  }
}

export default UsersController;
