import models from '../models';
import logger from '../helpers/logger';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

const { ArticleCategory } = models;

/**
 * This class represents an article category entity
 * @class CategoriesController
 */
export default class CategoriesController {
  /**
   * This function gets all categories in the database
   * @param {Object} request - This is the request object
   * @param {Object} response - This is the response object
   * @returns {Object} - This function returns a response object
   */
  static async getAll(request, response) {
    try {
      const categories = await ArticleCategory.findAll({ raw: true });
      return Response.send(response, STATUS.OK, categories, 'Successful');
    } catch (e) {
      logger.log(e);
      return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occurred', false);
    }
  }
}
