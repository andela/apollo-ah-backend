import jwt from 'jsonwebtoken';
import Response from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';
import { env } from '../helpers/utils';

/**
 * Verifies jwt
 *
 * @export
 * @class Tokenizer
 */
export default class Tokenizer {
  /**
   * Verifies the jwt from reset Password
   *
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next function to pass control to the next middleware
   * @memberof Tokenizer
   * @static
   * @returns {void}
   */
  static verifyResetPassword(request, response, next) {
    try {
      const { email } = jwt.verify(request.query.token, env('PASSWORD_RESET_KEY'));
      request.recoveryEmail = email;
      next();
    } catch (error) {
      return Response.send(response, STATUS.UNATHORIZED, [], MESSAGE.PASSWORD_LINK_EXPIRED, false);
    }
  }
}
