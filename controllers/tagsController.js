import createError from 'http-errors';
import models from '../models';
import { env, generateToken } from '../helpers/utils';
import Mail from '../helpers/sendMail';
import ResponseHandler from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';
import logger from '../helpers/logger';

/**
 * Class representing tags controller
 *
 * @class TagsController
 */
class TagsController {
  /**
   * Creates a new user resource
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof TagsController
   */
  static async index(request, response, next) {
    try {
      const result = await models.Tag.findAll({ group: ['tagName'] });

      const tags = result.map(tag => tag.tagName);
      ResponseHandler.send(response, STATUS.OK, tags, '');
    } catch (error) {
      next(error);
    }
  }
}

export default TagsController;
