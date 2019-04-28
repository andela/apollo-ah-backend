import { STATUS } from './constants';

/**
 * Wrapper class for sending responses.
 *
 * @export
 * @class Response
 */
export default class Response {
  /**
   * Configures the response object, then sends the response
   *
   * @static
   * @param {function} response The response object
   * @param {number} [code=STATUS.OK] The HTTP status code
   * @param {object} [data=[]] The actual data to send. It can be any data type
   * @param {string} [message=''] A descriptive message to send with the response.
   * @param {boolean} [status=true] Set to true for success response and false for error responses
   * @memberof Response
   * @returns {void}
   */
  static send(response, code = STATUS.OK, data = [], message = '', status = true) {
    return response.status(code).json({
      code, data, message, status
    });
  }
}
