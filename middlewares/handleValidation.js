import { validationResult } from 'express-validator/check';
import { STATUS, MESSAGE, expressValidatorFormater } from '../helpers/constants';
import Response from '../helpers/responseHelper';
/**
 * Wrapper class to handle validation results from exprsss-validator
 *
 * @export
 * @class Handler
 */
export default class Handler {
  /**
   * Validates the registration parameters
   *
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next function to transfer control to the next middleware
   * @returns {void}
   */
  static handleRegistration(request, response, next) {
    Handler.handle(request, response, next, MESSAGE.REGISTRATION_ERROR);
  }

  /**
   * Validates the recover password parameters
   *
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next function to transfer control to the next middleware
   * @returns {void}
   */
  static handleForgotPassword(request, response, next) {
    Handler.handle(request, response, next, MESSAGE.PASSWORD_REQUEST_FAILED);
  }

  /**
   * Validates the error array from express validator
   *
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next function to transfer control to the next middleware
   * @param {string} message The message to send if there are errors
   * @returns {void}
   */
  static handle(request, response, next, message) {
    const errors = validationResult(request).formatWith(expressValidatorFormater);
    if (!errors.isEmpty()) {
      return Response.send(
        response,
        STATUS.BAD_REQUEST,
        errors.array({ onlyFirstError: true }),
        message,
        false,
      );
    }
    next();
  }
}
