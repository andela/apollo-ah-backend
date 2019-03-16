import models from '../models';
import ResponseHandler from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

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
